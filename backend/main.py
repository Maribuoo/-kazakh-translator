import os
import io
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import fitz
from docx import Document
from pptx import Presentation
from docx.shared import Pt

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def extract_text_from_pdf(b):
    doc = fitz.open(stream=b, filetype="pdf")
    return "\n\n".join(p.get_text() for p in doc).strip()

def extract_text_from_docx(b):
    doc = Document(io.BytesIO(b))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip()).strip()

def extract_text_from_pptx(b):
    prs = Presentation(io.BytesIO(b))
    texts = []
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    line = " ".join(run.text for run in para.runs).strip()
                    if line:
                        texts.append(line)
    return "\n".join(texts).strip()

def translate_to_kazakh(text):
    prompt = f"""Сен — қазақ тілінің кәсіби аудармашысысың. Мемлекеттік құжаттарды аударуда тәжірибелісің.

        Аудару талаптары:
        - Тек кириллица қарпін қолдан
        - Ресми мемлекеттік стильді сақта
        - Орыс сөздерінің орнына қазақ баламаларын қолдан:
        * «критерии» → «өлшемшарттар»
        * «аттестация нәтижелері» → «аттестаттау қорытындылары»
        * «продвижение» → «ілгерілету»
        - Заңдық терминдерді дәл аудар
        - Мәтін құрылымы мен нөмірлеуін сақта
        - Тек аударманы жаз, түсініктеме берме

        Аударылатын мәтін:
        {text}"""
    return model.generate_content(prompt).text

def make_docx(text):
    doc = Document()
    for p in text.split("\n"):
        if p.strip():
            doc.add_paragraph(p.strip())
    buf = io.BytesIO()
    doc.save(buf)
    buf.seek(0)
    return buf.read()

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/translate")
async def translate_document(file: UploadFile = File(...)):
    name = file.filename.lower()
    if not (name.endswith(".pdf") or name.endswith(".docx") or name.endswith(".txt") or name.endswith(".pptx")):
        raise HTTPException(400, "Только PDF, DOCX, PPTX, TXT")
    b = await file.read()
    if name.endswith(".pdf"):
        text = extract_text_from_pdf(b)
    elif name.endswith(".docx"):
        text = extract_text_from_docx(b)
    elif name.endswith(".pptx"):
        text = extract_text_from_pptx(b)
    else:
        text = b.decode("utf-8")
    if not text.strip():
        raise HTTPException(422, "Файл пустой")
    translated = translate_to_kazakh(text)
    docx_bytes = make_docx(translated)
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=translated_kazakh.docx"}
    )
