# SpecMint-API

Automated API documentation generator for any backend framework. Paste your code, get clean Markdown docs with tables, endpoint cards, and response examples — powered by AI.

## Supported Languages & Frameworks

| Language | Frameworks |
|----------|------------|
| JavaScript | Express.js |
| Python | Flask, FastAPI, Django |
| Ruby | Ruby on Rails |
| Go | Gin, Echo, net/http |
| Java | Spring Boot |
| PHP | Laravel |
| C# | ASP.NET Core |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS, react-markdown, remark-gfm |
| Backend | Node.js, Express 5 |
| AI | HuggingFace Inference (Llama 3) / Google Gemini |

## Project Structure

```
SpecMint-API/
├── backend/
│   └── src/
│       ├── server.js              # Express server (port 3001)
│       ├── controllers/
│       │   └── analyzeController.js
│       └── utils/
│           ├── extractor.js       # Multi-language route extraction
│           ├── languageDetector.js # Auto-detect programming language
│           ├── prompts.js         # Language-specific AI prompts
│           ├── huggingface.js     # HuggingFace prompt + API
│           └── gemini.js          # Gemini prompt + API
├── frontend/
│   └── src/
│       ├── App.jsx                # Main layout (split pane)
│       ├── components/
│       │   ├── CodeEditor.jsx     # Multi-language code editor
│       │   └── MarkdownViewer.jsx # Markdown renderer (react-markdown + remark-gfm)
│       └── index.css              # Tailwind + markdown-body styles
├── samples/                       # Example code
└── package.json                   # Root scripts (dev, dev:backend, dev:frontend)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A HuggingFace API key **or** a Google Gemini API key

### Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Configure environment
cp backend/.env.example backend/.env   # or create manually
```

Create `backend/.env`:

```
PORT=3001
HF_API_KEY=hf_xxxxxxxxxxxxxxxx
# or
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxx
```

### Run

```bash
# Both servers at once (backend :3001 + frontend :5173)
npm run dev

# Or separately
npm run dev:backend
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/languages` | List supported languages |
| POST | `/api/analyze` | Send code, get Markdown docs |

**POST /api/analyze** — Request body:

```json
{
  "code": "const router = require('express').Router(); ...",
  "language": "express"
}
```

Response:

```json
{
  "routes": [{ "method": "GET", "path": "/api/v1/users" }],
  "markdown": "# API Documentation\n\n## Endpoints\n...",
  "detectedLanguage": "express",
  "languageName": "Express.js"
}
```

## Features

- **Multi-language support** — Works with Express.js, Flask, FastAPI, Django, Rails, Gin, Spring, Laravel, ASP.NET
- **Auto-detection** — Automatically detects the programming language from code patterns
- **Language selector** — Manual language selection with sample code for each framework
- **Route extraction** — Parses code to find all route definitions
- **AI documentation** — Generates descriptions, parameters, example responses, and error responses from source code
- **GitHub-flavored tables** — Endpoint summary rendered as proper Markdown tables with method badges
- **Language-aware syntax highlighting** — Code editor highlights keywords specific to each language
- **Dark-mode UI** — Split pane editor + live markdown preview with copy-to-clipboard

## License

ISC
