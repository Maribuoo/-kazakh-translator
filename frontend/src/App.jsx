import { useState, useRef, useCallback } from 'react'

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Golos Text', sans-serif;
    background: #0a0a0f;
    color: #e8e6df;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 24px;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(20, 100, 255, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .bg-glow-2 {
    position: fixed;
    bottom: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(0, 200, 120, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    color: rgba(232,230,223,0.5);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .logo-dot {
    width: 6px;
    height: 6px;
    background: #00c87a;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  h1 {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #f0ede6;
  }

  h1 span {
    color: #1464ff;
  }

  .subtitle {
    font-size: 15px;
    color: rgba(232,230,223,0.45);
    line-height: 1.6;
    max-width: 420px;
  }

  .upload-zone {
    width: 100%;
    border: 1.5px dashed rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 56px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255,255,255,0.02);
    position: relative;
    overflow: hidden;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: rgba(20, 100, 255, 0.5);
    background: rgba(20, 100, 255, 0.04);
  }

  .upload-zone.drag-over {
    transform: scale(1.01);
  }

  .upload-icon {
    width: 56px;
    height: 56px;
    background: rgba(20,100,255,0.1);
    border: 1px solid rgba(20,100,255,0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .upload-title {
    font-family: 'Golos Text', sans-serif;
    font-weight: 500;
    font-size: 17px;
    color: #e8e6df;
  }

  .upload-sub {
    font-size: 13px;
    color: rgba(232,230,223,0.35);
    text-align: center;
    line-height: 1.5;
  }

  .upload-btn {
    background: #1464ff;
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 10px;
    font-family: 'Golos Text', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
  }

  .upload-btn:hover {
    background: #0050e6;
    transform: translateY(-1px);
  }

  .file-card {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .file-icon {
    width: 44px;
    height: 44px;
    background: rgba(20,100,255,0.12);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .file-info {
    flex: 1;
    min-width: 0;
  }

  .file-name {
    font-weight: 500;
    font-size: 15px;
    color: #e8e6df;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-size {
    font-size: 12px;
    color: rgba(232,230,223,0.35);
    margin-top: 2px;
  }

  .remove-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(232,230,223,0.4);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: rgba(255,60,60,0.1);
    border-color: rgba(255,60,60,0.2);
    color: #ff4444;
  }

  .translate-btn {
    width: 100%;
    background: #1464ff;
    color: #fff;
    border: none;
    padding: 18px;
    border-radius: 14px;
    font-family: 'Unbounded', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .translate-btn:hover:not(:disabled) {
    background: #0050e6;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(20,100,255,0.3);
  }

  .translate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .progress-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: rgba(232,230,223,0.5);
  }

  .progress-bar-bg {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1464ff, #00c8ff);
    border-radius: 100px;
    transition: width 0.4s ease;
    animation: shimmer 1.5s linear infinite;
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .steps {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
    color: rgba(232,230,223,0.4);
  }

  .step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
  }

  .step-dot.active {
    background: #1464ff;
    animation: pulse 1s ease-in-out infinite;
  }

  .step-dot.done {
    background: #00c87a;
  }

  .success-card {
    width: 100%;
    background: rgba(0, 200, 122, 0.05);
    border: 1px solid rgba(0, 200, 122, 0.2);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }

  .success-icon {
    width: 52px;
    height: 52px;
    background: rgba(0,200,122,0.1);
    border: 1px solid rgba(0,200,122,0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .success-title {
    font-family: 'Golos Text', sans-serif;
    font-weight: 500;
    font-size: 17px;
    color: #e8e6df;
  }

  .success-sub {
    font-size: 13px;
    color: rgba(232,230,223,0.4);
  }

  .download-btn {
    background: #00c87a;
    color: #001a0e;
    border: none;
    padding: 13px 32px;
    border-radius: 10px;
    font-family: 'Golos Text', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .download-btn:hover {
    background: #00e68a;
    transform: translateY(-1px);
  }

  .again-btn {
    background: transparent;
    color: rgba(232,230,223,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 10px 24px;
    border-radius: 10px;
    font-family: 'Golos Text', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .again-btn:hover {
    color: rgba(232,230,223,0.7);
    border-color: rgba(255,255,255,0.15);
  }

  .error-card {
    width: 100%;
    background: rgba(255,60,60,0.05);
    border: 1px solid rgba(255,60,60,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 14px;
    color: #ff7070;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .formats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .format-pill {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 12px;
    color: rgba(232,230,223,0.35);
    font-family: 'Golos Text', sans-serif;
  }
`

const STEPS = ['Читаю документ', 'Перевожу на казахский', 'Создаю файл']

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' Б'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ'
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ'
}

function getFileIcon(name) {
  if (name.endsWith('.pdf')) return '📄'
  if (name.endsWith('.docx')) return '📝'
  return '📋'
}

export default function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadName, setDownloadName] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    const ok = f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt') || f.name.endsWith('.pptx')
    if (!ok) { setError('Поддерживаются только PDF, DOCX, PPTX, TXT'); return }
    setFile(f)
    setError('')
    setStatus('idle')
    setDownloadUrl(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }, [])

  const simulateProgress = () => {
    let s = 0
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 8 + 2
      if (p >= 33 && s === 0) { s = 1; setStep(1) }
      if (p >= 66 && s === 1) { s = 2; setStep(2) }
      if (p >= 95) { p = 95; clearInterval(interval) }
      setProgress(Math.min(p, 95))
    }, 400)
    return interval
  }

  const handleTranslate = async () => {
    if (!file) return
    setStatus('loading')
    setStep(0)
    setProgress(0)
    setError('')

    const interval = simulateProgress()

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('https://kazakh-translator-production.up.railway.app/translate', { method: 'POST', body: form })

      clearInterval(interval)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Ошибка сервера')
      }

      setProgress(100)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const outName = file.name.replace(/\.[^.]+$/, '') + '_казахский.docx'
      setDownloadUrl(url)
      setDownloadName(outName)
      setTimeout(() => setStatus('done'), 300)
    } catch (e) {
      clearInterval(interval)
      setError(e.message || 'Что-то пошло не так')
      setStatus('error')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setStep(0)
    setProgress(0)
    setDownloadUrl(null)
    setError('')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="bg-glow" />
        <div className="bg-glow-2" />

        <div className="content">
          <div className="header">
            <div className="logo-badge">
              <div className="logo-dot" />
              AI Аудармашы
            </div>
            <h1>Аудару <span>қазақ</span><br />тіліне</h1>
            <p className="subtitle">
              Ресми құжаттарды PDF, DOCX немесе TXT форматынан қазақ тіліне жоғары сапалы аударма
            </p>
          </div>

          {status === 'idle' && (
            <>
              {!file ? (
                <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current.click()}
                >
                  <div className="upload-icon">📎</div>
                  <div className="upload-title">Перетащи файл сюда</div>
                  <div className="upload-sub">или выбери с компьютера</div>
                  <button className="upload-btn" onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}>
                    Выбрать файл
                  </button>
                  <div className="formats">
                    {['PDF', 'DOCX', 'PPTX', 'TXT'].map(f => (
                      <span key={f} className="format-pill">{f}</span>
                    ))}
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <>
                  <div className="file-card">
                    <div className="file-icon">{getFileIcon(file.name)}</div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatSize(file.size)}</div>
                    </div>
                    <button className="remove-btn" onClick={reset}>✕</button>
                  </div>
                  <button className="translate-btn" onClick={handleTranslate}>
                    <span>Аудару</span>
                    <span>→</span>
                  </button>
                </>
              )}
            </>
          )}

          {status === 'loading' && (
            <div className="progress-wrap">
              <div className="steps">
                {STEPS.map((s, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
                    <span style={{ color: i === step ? '#e8e6df' : i < step ? '#00c87a' : 'rgba(232,230,223,0.3)' }}>
                      {s}
                    </span>
                    {i < STEPS.length - 1 && <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 4px' }}>—</span>}
                  </span>
                ))}
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-label">
                <span>{file?.name}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {status === 'done' && (
            <div className="success-card">
              <div className="success-icon">✓</div>
              <div className="success-title">Аударма дайын!</div>
              <div className="success-sub">Файл сәтті қазақ тіліне аударылды</div>
              <a href={downloadUrl} download={downloadName} style={{ textDecoration: 'none' }}>
                <button className="download-btn">
                  <span>↓</span> Скачать DOCX
                </button>
              </a>
              <button className="again-btn" onClick={reset}>Перевести ещё один</button>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className="error-card">
                <span>⚠</span>
                <span>{error}</span>
              </div>
              <button className="again-btn" onClick={reset}>Попробовать снова</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
