# Казахский переводчик документов

## Быстрый старт

### 1. Получи API ключ
Зайди на https://console.anthropic.com → Sign Up → API Keys → Create Key
Скопируй ключ (начинается с `sk-ant-...`)

### 2. Запусти бэкенд

```bash
cd backend

# Установи зависимости (один раз)
pip install -r requirements.txt

# Укажи API ключ и запусти
export ANTHROPIC_API_KEY="sk-ant-ВАШ_КЛЮЧ"
uvicorn main:app --reload
```

Бэкенд запустится на http://localhost:8000

### 3. Запусти фронтенд (в новом терминале)

```bash
cd frontend

# Установи зависимости (один раз)
npm install

# Запусти
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
- TXT

Результат всегда выдаётся в формате DOCX.
