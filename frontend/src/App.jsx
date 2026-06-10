import { useState, useRef, useCallback, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #38BDF8;
    --blue-dark: #0B2341;
    --blue-light: #7DD3FC;
    --bg: #F7F9FC;
    --white: #ffffff;
    --text: #0B2341;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --success: #00A86B;
    --radius: 16px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Manrope', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── NAV ── */
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 48px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-badge {
    background: var(--blue);
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.06em;
  }

  .nav-name {
    font-size: 17px;
    font-weight: 800;
    color: var(--blue);
    letter-spacing: -0.01em;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .nav-link {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
  }

  .nav-link:hover { color: var(--blue); }

  .nav-cta {
    background: var(--blue);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }

  .nav-cta:hover { background: #0049a0; }

  /* ── HERO ── */
  .hero {
    background: var(--white);
    padding: 80px 48px 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-left { flex: 1; max-width: 560px; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--blue);
    letter-spacing: 0.04em;
    margin-bottom: 24px;
  }

  .hero-dot {
    width: 7px; height: 7px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.5; transform:scale(0.7); }
  }

  .hero h1 {
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--blue-dark);
    margin-bottom: 20px;
  }

  .hero h1 span { color: var(--blue); }

  .hero-sub {
    font-size: 16px;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 28px;
    max-width: 480px;
  }

  .hero-trust {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 36px;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .trust-check {
    width: 20px; height: 20px;
    background: #DCFCE7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--success);
    flex-shrink: 0;
  }

  .hero-btns {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn-primary {
    background: var(--blue);
    color: #fff;
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary:hover {
    background: #0049a0;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,87,184,0.25);
  }

  .btn-secondary {
    background: transparent;
    color: var(--blue);
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 14px 24px;
    border-radius: 10px;
    border: 1.5px solid #BFDBFE;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-secondary:hover { background: #EFF6FF; }

  /* ── HERO RIGHT: HEXAGONS ── */
  .hero-right {
    flex-shrink: 0;
    width: 400px;
    height: 380px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hex-grid {
    position: relative;
    width: 360px;
    height: 360px;
  }

  .hex {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    transition: transform 0.2s;
  }

  .hex:hover { transform: scale(1.05); }

  .hex-center {
    width: 120px; height: 138px;
    background: linear-gradient(135deg, var(--blue), #0049a0);
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    text-align: center;
    line-height: 1.3;
    gap: 4px;
  }

  .hex-center:hover { transform: translate(-50%, -50%) scale(1.05); }

  .hex-label { font-size: 9px; opacity: 0.8; letter-spacing: 0.05em; }

  .hex-sm {
    width: 82px; height: 94px;
    font-size: 11px;
    font-weight: 700;
    gap: 3px;
  }

  .hex-sm .hex-icon { font-size: 18px; }

  .hex-blue { background: #EFF6FF; color: var(--blue); border: 2px solid #BFDBFE; }
  .hex-teal { background: #F0FDFA; color: #0D9488; border: 2px solid #99F6E4; }
  .hex-purple { background: #FAF5FF; color: #7C3AED; border: 2px solid #DDD6FE; }
  .hex-amber { background: #FFFBEB; color: #D97706; border: 2px solid #FDE68A; }
  .hex-green { background: #F0FDF4; color: #16A34A; border: 2px solid #BBF7D0; }
  .hex-rose { background: #FFF1F2; color: #E11D48; border: 2px solid #FECDD3; }

  /* DIVIDER */
  .section-divider {
    height: 1px;
    background: var(--border);
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── STATS ── */
  .stats-section {
    background: var(--blue-dark);
    padding: 40px 48px;
  }

  .stats-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
  }

  .stat-card {
    background: rgba(255,255,255,0.04);
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: background 0.15s;
  }

  .stat-card:hover { background: rgba(255,255,255,0.08); }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .stat-value span { color: var(--blue-light); }

  .stat-label {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    font-weight: 500;
  }

  /* ── UPLOAD SECTION ── */
  .upload-section {
    padding: 64px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .section-tag {
    display: inline-block;
    background: #EFF6FF;
    color: var(--blue);
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    color: var(--blue-dark);
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }

  .section-sub {
    font-size: 15px;
    color: var(--text-muted);
  }

  .upload-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.06);
    overflow: hidden;
    max-width: 760px;
    margin: 0 auto;
  }

  /* TABS */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: #FAFBFD;
  }

  .tab {
    flex: 1;
    padding: 16px;
    background: none;
    border: none;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }

  .tab:hover { color: var(--blue); background: #F0F6FF; }
  .tab.active { color: var(--blue); border-bottom-color: var(--blue); background: var(--white); }

  .card-body { padding: 36px; }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed #CBD5E1;
    border-radius: 14px;
    padding: 52px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.2s;
    background: #FAFBFD;
    text-align: center;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--blue);
    background: #EFF6FF;
  }

  .upload-icon-wrap {
    width: 64px; height: 64px;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .upload-title { font-size: 17px; font-weight: 700; color: var(--blue-dark); }
  .upload-sub { font-size: 13px; color: var(--text-muted); }

  .upload-btn {
    background: var(--blue);
    color: #fff;
    border: none;
    padding: 11px 26px;
    border-radius: 9px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .upload-btn:hover { background: #0049a0; }

  .formats { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }

  .format-pill {
    background: #F1F5F9;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 3px 11px;
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }

  /* FILE CARD */
  .file-card {
    background: #FAFBFD;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .file-icon {
    width: 44px; height: 44px;
    background: #EFF6FF;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .file-info { flex: 1; min-width: 0; }

  .file-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--blue-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-size { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  .remove-btn {
    background: #F1F5F9;
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 32px; height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .remove-btn:hover { background: #FEE2E2; border-color: #FECACA; color: #EF4444; }

  /* TEXT AREA */
  .text-area {
    width: 100%;
    height: 200px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    color: var(--text);
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    background: #FAFBFD;
    margin-bottom: 8px;
    line-height: 1.6;
  }

  .text-area:focus { border-color: var(--blue); background: var(--white); }
  .text-area::placeholder { color: #94A3B8; }
  .char-count { text-align: right; font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }

  /* TRANSLATE BTN */
  .translate-btn {
    width: 100%;
    background: var(--blue);
    color: #fff;
    border: none;
    padding: 17px;
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    letter-spacing: 0.01em;
  }

  .translate-btn:hover:not(:disabled) {
    background: #0049a0;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(0,87,184,0.25);
  }

  .translate-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* PROGRESS */
  .progress-wrap { display: flex; flex-direction: column; gap: 16px; }

  .steps { display: flex; gap: 8px; align-items: center; font-size: 13px; flex-wrap: wrap; }

  .step-item { display: flex; align-items: center; gap: 6px; color: #94A3B8; font-weight: 500; }
  .step-item.active { color: var(--blue); }
  .step-item.done { color: var(--success); }

  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #E2E8F0; flex-shrink: 0; }
  .step-dot.active { background: var(--blue); animation: pulse 1s ease-in-out infinite; }
  .step-dot.done { background: var(--success); }
  .step-sep { color: #CBD5E1; }

  .progress-bar-bg {
    width: 100%; height: 6px;
    background: #E2E8F0;
    border-radius: 100px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blue), var(--blue-light));
    border-radius: 100px;
    transition: width 0.4s ease;
  }

  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }

  /* SUCCESS */
  .success-card {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 14px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }

  .success-icon {
    width: 54px; height: 54px;
    background: #DCFCE7;
    border: 1px solid #BBF7D0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .success-title { font-size: 18px; font-weight: 700; color: var(--blue-dark); }
  .success-sub { font-size: 13px; color: var(--text-muted); }

  .download-btn {
    background: var(--success);
    color: #fff;
    border: none;
    padding: 13px 30px;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .download-btn:hover { background: #008f5a; transform: translateY(-1px); }

  .text-result {
    background: #FAFBFD;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 12px;
  }

  .btn-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

  .copy-btn {
    background: #F1F5F9;
    border: 1px solid var(--border);
    color: var(--blue);
    padding: 10px 22px;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .copy-btn:hover { background: #EFF6FF; border-color: #BFDBFE; }

  .again-btn {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 10px 22px;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .again-btn:hover { color: var(--text); border-color: #94A3B8; }

  /* ERROR */
  .error-card {
    background: #FFF1F2;
    border: 1px solid #FECDD3;
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 14px;
    color: #E11D48;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
  }

  /* ── BENEFITS ── */
  .benefits-section {
    background: var(--white);
    padding: 64px 48px;
    border-top: 1px solid var(--border);
  }

  .benefits-grid {
    max-width: 1200px;
    margin: 40px auto 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .benefit-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 24px;
    transition: all 0.2s;
  }

  .benefit-card:hover {
    border-color: #BFDBFE;
    background: #F8FBFF;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,87,184,0.08);
  }

  .benefit-icon {
    width: 48px; height: 48px;
    background: #EFF6FF;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 16px;
  }

  .benefit-title { font-size: 15px; font-weight: 700; color: var(--blue-dark); margin-bottom: 8px; }
  .benefit-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  /* ── PROCESS ── */
  .process-section {
    padding: 64px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .process-steps {
    display: flex;
    align-items: flex-start;
    gap: 0;
    margin-top: 40px;
    position: relative;
  }

  .process-steps::before {
    content: '';
    position: absolute;
    top: 28px;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, var(--blue), var(--blue-light));
    z-index: 0;
  }

  .process-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .process-num {
    width: 56px; height: 56px;
    background: var(--white);
    border: 2px solid var(--blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    color: var(--blue);
  }

  .process-title { font-size: 14px; font-weight: 700; color: var(--blue-dark); }
  .process-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; max-width: 140px; }

  /* ── FOOTER ── */
  .footer {
    background: var(--blue-dark);
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255,255,255,0.9);
    font-size: 14px;
    font-weight: 600;
  }

  .footer-badge {
    background: var(--blue);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 5px;
  }

  .footer-right { font-size: 12px; color: rgba(255,255,255,0.4); }
`

const STEPS = ['Құжатты оқу', 'Аудару', 'Файл жасау']
const BENEFITS = [
  { icon: '🏛️', title: 'Мемлекеттік стиль', desc: 'Ресми терминология мен мемлекеттік стандарттарға сәйкес аударма' },
  { icon: '📐', title: 'Құрылымды сақтау', desc: 'Нөмірлеу, кесте және бөлімдер толық сақталады' },
  { icon: '⚡', title: 'Жылдам өңдеу', desc: 'AI технологиясы арқылы минуттар ішінде нәтиже' },
  { icon: '🔒', title: 'Қауіпсіздік', desc: 'Деректер сақталмайды, барлық аударма жасырын болады' },
]
const PROCESS = [
  { num: '01', icon: '📤', title: 'Жүктеу', desc: 'PDF, DOCX, PPTX немесе TXT файлды жүктеңіз' },
  { num: '02', icon: '🤖', title: 'AI өңдеу', desc: 'Жасанды интеллект мәтінді талдайды' },
  { num: '03', icon: '✅', title: 'Тексеру', desc: 'Терминология мен стиль тексерілді' },
  { num: '04', icon: '📥', title: 'Жүктеп алу', desc: 'DOCX форматында нәтижені алыңыз' },
]

function formatSize(b) {
  if (b < 1024) return b + ' Б'
  if (b < 1048576) return (b/1024).toFixed(1) + ' КБ'
  return (b/1048576).toFixed(1) + ' МБ'
}

function getFileIcon(n) {
  if (n.endsWith('.pdf')) return '📄'
  if (n.endsWith('.docx')) return '📝'
  if (n.endsWith('.pptx')) return '📊'
  return '📋'
}

// Hexagon positions (center + 6 surrounding)
const HEX_POSITIONS = [
  { top: '50%', left: '50%', label: 'TILMASH\nAI', cls: 'hex-center', isCenter: true },
  { top: '6%',  left: '50%', icon: '📄', label: 'PDF',   cls: 'hex-sm hex-blue' },
  { top: '27%', left: '80%', icon: '📝', label: 'DOCX',  cls: 'hex-sm hex-teal' },
  { top: '68%', left: '80%', icon: '📊', label: 'PPTX',  cls: 'hex-sm hex-purple' },
  { top: '88%', left: '50%', icon: '📋', label: 'TXT',   cls: 'hex-sm hex-amber' },
  { top: '68%', left: '20%', icon: '🇰🇿', label: 'ҚАЗАҚ', cls: 'hex-sm hex-green' },
  { top: '27%', left: '20%', icon: '🏛️', label: 'ГОС',   cls: 'hex-sm hex-rose' },
]

export default function App() {
  const [tab, setTab] = useState('file')
  const [file, setFile] = useState(null)
  const [inputText, setInputText] = useState('')
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadName, setDownloadName] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [stats, setStats] = useState({ visits: 0, translations: 0 })
  const [copied, setCopied] = useState(false)
  const inputRef = useRef()
  const uploadRef = useRef()

  useEffect(() => {
    fetch(`${API}/stats`).then(r => r.json()).then(setStats).catch(() => {})
    fetch(`${API}/visit`, { method: 'POST' }).catch(() => {})
  }, [])

  const handleFile = (f) => {
    if (!f) return
    const ok = ['.pdf','.docx','.txt','.pptx'].some(ext => f.name.toLowerCase().endsWith(ext))
    if (!ok) { setError('Тек PDF, DOCX, PPTX, TXT форматтары қолданылады'); return }
    setFile(f); setError(''); setStatus('idle'); setDownloadUrl(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0])
  }, [])

  const simulateProgress = () => {
    let s = 0, p = 0
    const iv = setInterval(() => {
      p += Math.random() * 7 + 2
      if (p >= 33 && s === 0) { s = 1; setStep(1) }
      if (p >= 66 && s === 1) { s = 2; setStep(2) }
      if (p >= 95) { p = 95; clearInterval(iv) }
      setProgress(Math.min(p, 95))
    }, 400)
    return iv
  }

  const handleTranslateFile = async () => {
    if (!file) return
    setStatus('loading'); setStep(0); setProgress(0); setError('')
    const iv = simulateProgress()
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API}/translate`, { method: 'POST', body: form })
      clearInterval(iv)
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).detail || 'Қате')
      setProgress(100)
      const blob = await res.blob()
      setDownloadUrl(URL.createObjectURL(blob))
      setDownloadName(file.name.replace(/\.[^.]+$/, '') + '_қазақша.docx')
      setStats(s => ({ ...s, translations: s.translations + 1 }))
      setTimeout(() => setStatus('done'), 300)
    } catch (e) {
      clearInterval(iv)
      setError('Сервис уақытша қолжетімсіз. Қайталап көріңіз.')
      setStatus('error')
    }
  }

  const handleTranslateText = async () => {
    if (!inputText.trim()) return
    setStatus('loading'); setStep(0); setProgress(0); setError('')
    const iv = simulateProgress()
    try {
      const res = await fetch(`${API}/translate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
      clearInterval(iv)
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).detail || 'Қате')
      setProgress(100)
      setTranslatedText((await res.json()).translated)
      setStats(s => ({ ...s, translations: s.translations + 1 }))
      setTimeout(() => setStatus('done'), 300)
    } catch (e) {
      clearInterval(iv)
      setError('Сервис уақытша қолжетімсіз. Қайталап көріңіз.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFile(null); setInputText(''); setStatus('idle')
    setStep(0); setProgress(0); setDownloadUrl(null)
    setTranslatedText(''); setError('')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-left">
            <span className="nav-badge">КТЖ</span>
            <span className="nav-name">ИС Тілмаш</span>
          </div>
          <div className="nav-right">
            <a href="#upload" className="nav-link">Аудару</a>
            <a href="#benefits" className="nav-link">Мүмкіндіктер</a>
            <a href="#process" className="nav-link">Процесс</a>
            <button className="nav-cta" onClick={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Аударуды бастау →
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
          <div className="hero">
            <div className="hero-left">
              <div className="hero-badge">
                <div className="hero-dot" />
                AI-powered official translation
              </div>
              <h1>Құжаттарды <span>қазақ</span> тіліне аудару</h1>
              <p className="hero-sub">
                PDF, DOCX, PPTX және TXT құжаттарын мемлекеттік стильге сәйкес жоғары сапада аудару
              </p>
              <div className="hero-trust">
                {['Мемлекеттік стиль', 'AI негізіндегі аударма', 'Құжат құрылымын сақтау'].map(t => (
                  <div key={t} className="trust-item">
                    <div className="trust-check">✓</div>
                    {t}
                  </div>
                ))}
              </div>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                  Аударуды бастау →
                </button>
                <button className="btn-secondary" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                  Мүмкіндіктер
                </button>
              </div>
            </div>

            {/* Hexagon grid */}
            <div className="hero-right">
              <div className="hex-grid">
                {HEX_POSITIONS.map((h, i) => (
                  <div
                    key={i}
                    className={`hex ${h.cls}`}
                    style={{ top: h.top, left: h.left, transform: h.isCenter ? 'translate(-50%,-50%)' : 'translate(-50%,-50%)' }}
                  >
                    {h.isCenter ? (
                      <>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>TILMASH</span>
                        <span className="hex-label">AI</span>
                      </>
                    ) : (
                      <>
                        <span className="hex-icon">{h.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 700 }}>{h.label}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <div className="stats-inner">
            <div className="stat-card">
              <div className="stat-value">{stats.translations.toLocaleString()}<span>+</span></div>
              <div className="stat-label">Аударылған құжаттар</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.visits.toLocaleString()}<span>+</span></div>
              <div className="stat-label">Посещений</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">98<span>.7%</span></div>
              <div className="stat-label">Сапа көрсеткіші</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt;<span>2 мин</span></div>
              <div className="stat-label">Орташа өңдеу уақыты</div>
            </div>
          </div>
        </section>

        {/* UPLOAD */}
        <section id="upload" ref={uploadRef} className="upload-section">
          <div className="section-header">
            <div className="section-tag">Аударма сервисі</div>
            <h2 className="section-title">Құжатыңызды жүктеңіз</h2>
            <p className="section-sub">Файл немесе мәтін арқылы аударма жасаңыз</p>
          </div>

          <div className="upload-card">
            <div className="tabs">
              <button className={`tab ${tab === 'file' ? 'active' : ''}`} onClick={() => { setTab('file'); reset() }}>
                📎 Файл жүктеу
              </button>
              <button className={`tab ${tab === 'text' ? 'active' : ''}`} onClick={() => { setTab('text'); reset() }}>
                ✏️ Мәтін енгізу
              </button>
            </div>

            <div className="card-body">

              {status === 'idle' && tab === 'file' && (
                <>
                  {!file ? (
                    <div
                      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current.click()}
                    >
                      <div className="upload-icon-wrap">📎</div>
                      <div className="upload-title">Файлды осында сүйреңіз</div>
                      <div className="upload-sub">немесе компьютерден таңдаңыз</div>
                      <button className="upload-btn" onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}>
                        Файл таңдау
                      </button>
                      <div className="formats">
                        {['PDF', 'DOCX', 'PPTX', 'TXT'].map(f => (
                          <span key={f} className="format-pill">{f}</span>
                        ))}
                      </div>
                      <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.pptx" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
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
                      <button className="translate-btn" onClick={handleTranslateFile}>
                        Аудару →
                      </button>
                    </>
                  )}
                </>
              )}

              {status === 'idle' && tab === 'text' && (
                <>
                  <textarea className="text-area" placeholder="Аударылатын мәтінді осында қойыңыз..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                  <div className="char-count">{inputText.length} символ</div>
                  <button className="translate-btn" onClick={handleTranslateText} disabled={!inputText.trim()}>
                    Аудару →
                  </button>
                </>
              )}

              {status === 'loading' && (
                <div className="progress-wrap">
                  <div className="steps">
                    {STEPS.map((s, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={`step-item ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                          <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
                          {s}
                        </span>
                        {i < STEPS.length - 1 && <span className="step-sep"> — </span>}
                      </span>
                    ))}
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-label">
                    <span>{tab === 'file' ? file?.name : 'Мәтін...'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              )}

              {status === 'done' && tab === 'file' && (
                <div className="success-card">
                  <div className="success-icon">✓</div>
                  <div className="success-title">Аударма дайын!</div>
                  <div className="success-sub">Файл сәтті қазақ тіліне аударылды</div>
                  <a href={downloadUrl} download={downloadName} style={{ textDecoration: 'none' }}>
                    <button className="download-btn">↓ DOCX жүктеу</button>
                  </a>
                  <button className="again-btn" onClick={reset}>Тағы аудару</button>
                </div>
              )}

              {status === 'done' && tab === 'text' && (
                <>
                  <div className="success-card" style={{ marginBottom: 16 }}>
                    <div className="success-icon">✓</div>
                    <div className="success-title">Аударма дайын!</div>
                  </div>
                  <div className="text-result">{translatedText}</div>
                  <div className="btn-row">
                    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(translatedText); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                      {copied ? '✓ Көшірілді' : '📋 Көшіру'}
                    </button>
                    <button className="again-btn" onClick={reset}>Тағы аудару</button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="error-card">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                  <button className="again-btn" onClick={reset}>Қайталап көру</button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section id="benefits" className="benefits-section">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-header">
              <div className="section-tag">Артықшылықтар</div>
              <h2 className="section-title">Неліктен Тілмаш?</h2>
              <p className="section-sub">Мемлекеттік стандарттарға сәйкес кәсіби аударма</p>
            </div>
            <div className="benefits-grid">
              {BENEFITS.map(b => (
                <div key={b.title} className="benefit-card">
                  <div className="benefit-icon">{b.icon}</div>
                  <div className="benefit-title">{b.title}</div>
                  <div className="benefit-desc">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="process-section">
          <div className="section-header">
            <div className="section-tag">Процесс</div>
            <h2 className="section-title">Қалай жұмыс істейді?</h2>
            <p className="section-sub">4 қадамда кәсіби аударма</p>
          </div>
          <div className="process-steps">
            {PROCESS.map((p, i) => (
              <div key={i} className="process-step">
                <div className="process-num">{p.num}</div>
                <div style={{ fontSize: 24 }}>{p.icon}</div>
                <div className="process-title">{p.title}</div>
                <div className="process-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-left">
            <span className="footer-badge">КТЖ</span>
            ИС Тілмаш
          </div>
          <div className="footer-right">© 2026 Қазақстан Темір Жолы · Барлық құқықтар қорғалған</div>
        </footer>
      </div>
    </>
  )
}
