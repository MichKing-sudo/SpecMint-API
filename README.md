# SpecMint-API

Automated API documentation generator for Node.js/Express backends. Paste your code, get clean Markdown docs with tables, endpoint cards, and response examples — powered by AI.

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
│           ├── extractor.js       # Route extraction from code
│           ├── huggingface.js     # HuggingFace prompt + API
│           └── gemini.js          # Gemini prompt + API
├── frontend/
│   └── src/
│       ├── App.jsx                # Main layout (split pane)
│       ├── components/
│       │   ├── CodeEditor.jsx     # Code input editor
│       │   └── MarkdownViewer.jsx # Markdown renderer (react-markdown + remark-gfm)
│       └── index.css              # Tailwind + markdown-body styles
├── samples/                       # Example Express code
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
| POST | `/api/analyze` | Send Express code, get Markdown docs |

**POST /api/analyze** — Request body:

```json
{ "code": "const router = require('express').Router(); ..." }
```

Response:

```json
{
  "routes": [{ "method": "GET", "path": "/api/v1/users" }],
  "markdown": "# API Documentation\n\n## Endpoints\n..."
}
```

## Features

- **Route extraction** — Parses Express code to find all `router.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` calls
- **AI documentation** — Generates descriptions, parameters, example responses, and error responses from source code
- **GitHub-flavored tables** — Endpoint summary rendered as proper Markdown tables with method badges
- **Path param detection** — Only lists `req.params` for routes containing `:` segments
- **204 handling** — Endpoints with no body show `No Content (Status 204)` instead of empty code blocks
- **Dark-mode UI** — Split pane editor + live markdown preview with copy-to-clipboard

## License

ISC
