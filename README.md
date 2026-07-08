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
│       │   └── analyzeController.js  # API analysis + markdown sanitization
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
│       │   ├── LanguageSelector.jsx # Custom dropdown with logos
│       │   ├── LanguageLogos.jsx  # SVG logos for each language
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

**GET /api/languages** — Response:

```json
[
  { "id": "express", "name": "Express.js" },
  { "id": "flask", "name": "Flask" },
  { "id": "fastapi", "name": "FastAPI" },
  ...
]
```

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

### Multi-Language Support
- **9 frameworks** across **7 programming languages**
- Works with Express.js, Flask, FastAPI, Django, Rails, Gin, Echo, net/http, Spring Boot, Laravel, ASP.NET Core

### Smart Auto-Detection
- Automatically detects the programming language from code patterns when you paste code
- Client-side detection for instant feedback
- Manual language selection available via custom dropdown

### Language Selector with Logos
- Custom dropdown component with official SVG logos for each language
- Auto-detect option with Globe icon
- Visual feedback showing selected language

### Strict JSON Response Formatting
- **All code blocks** always start with ` ```json` label
- **Boolean conversion**: `True`/`False` → `true`/`false` (works for Python, Ruby, etc.)
- **Null conversion**: `None`/`Null` → `null`
- Post-processing sanitization ensures consistent formatting

### AI-Powered Documentation
- Generates descriptions, parameters, example responses, and error responses
- Language-specific prompts for better accuracy
- GitHub-flavored Markdown tables with method badges

### Code Editor Features
- Multi-language syntax highlighting (keywords, decorators, methods)
- Language-aware placeholders
- Clear button resets language selection
- Split pane with live markdown preview

## Sanitization Rules

The backend automatically sanitizes AI responses before sending to frontend:

1. **Code block labels**: Empty or unlabeled blocks get `json` label
2. **Boolean normalization**: All booleans converted to lowercase `true`/`false`
3. **Null normalization**: All null values converted to lowercase `null`

Example:
```markdown
# Before sanitization
```
{"in_stock": True, "name": None}
```

# After sanitization
```json
{"in_stock": true, "name": null}
```
```

## License

ISC
