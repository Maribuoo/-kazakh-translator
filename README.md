# ИС Тілмаш — Казахский переводчик документов

Переводит официальные документы (PDF, DOCX, PPTX, TXT) на казахский язык с помощью локальной AI модели через Ollama.

## Требования

- [Ollama](https://ollama.com) — локальный запуск моделей
- Python 3.10+
- Node.js

## Быстрый старт

### 1. Установи Ollama и скачай модель

Скачай Ollama с [ollama.com](https://ollama.com) и запусти его.

Затем скачай модель (выбери под свой сервер):

```bash
# Для Mac Apple Silicon (MLX-оптимизация)
ollama pull qwen3.5:4b-mlx

# Для сервера с GPU (NVIDIA)
ollama pull qwen3.5:9b
```

### 2. Запусти бэкенд

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Бэкенд запустится на http://localhost:8000

### 3. Запусти фронтенд (в новом терминале)

```bash
cd frontend
npm install
npm run dev
```

Открой браузер: http://localhost:5173

---

## Структура проекта

```
kazakh-translator/
├── backend/
│   ├── main.py          — FastAPI сервер
│   ├── requirements.txt — Python зависимости
│   └── .env.example     — пример переменных окружения
└── frontend/
    ├── src/
    │   ├── App.jsx      — главный компонент
    │   └── main.jsx     — точка входа
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Поддерживаемые форматы
- PDF
- DOCX (Word)
- PPTX (PowerPoint)
- TXT

Результат выдаётся в формате DOCX.

## Деплой на сервер с GPU

1. Установи Ollama на сервер
2. Скачай модель: `ollama pull qwen3.5:9b`
3. Запусти бэкенд через nginx или напрямую по IP
4. Фронтенд можно задеплоить на Vercel
