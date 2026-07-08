import { useState, useRef, useCallback, useMemo } from 'react';
import { Code2, Trash2 } from 'lucide-react';

const LANGUAGE_TOKENS = {
  express: [
    { type: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*"|`[^`]*`)/g },
    { type: 'keyword', regex: /\b(const|let|var|function|async|await|return|if|else|try|catch|throw|new|module|exports|require|import|from|export|default)\b/g },
    { type: 'method', regex: /\b(get|post|put|patch|delete|options|head)\b/g },
    { type: 'object', regex: /\b(res|req|router|app|console|Error|JSON|Math|Date|Promise)\b/g },
    { type: 'arrow', regex: /=>/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  flask: [
    { type: 'comment', regex: /(#.*$)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*")/g },
    { type: 'keyword', regex: /\b(def|class|return|if|else|elif|try|except|finally|import|from|as|with|for|while|in|not|and|or|True|False|None|self)\b/g },
    { type: 'decorator', regex: /@\w+/g },
    { type: 'method', regex: /\b(route|get|post|put|patch|delete|jsonify|request)\b/g },
    { type: 'object', regex: /\b(app|db|User|request|jsonify)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  fastapi: [
    { type: 'comment', regex: /(#.*$)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*")/g },
    { type: 'keyword', regex: /\b(def|class|return|if|else|elif|try|except|finally|import|from|as|with|for|while|in|not|and|or|True|False|None|self|async|await)\b/g },
    { type: 'decorator', regex: /@\w+/g },
    { type: 'method', regex: /\b(get|post|put|patch|delete|HTTPException|APIRouter|BaseModel)\b/g },
    { type: 'object', regex: /\b(app|router|User|Query|Path|Body)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  django: [
    { type: 'comment', regex: /(#.*$)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*")/g },
    { type: 'keyword', regex: /\b(def|class|return|if|else|elif|try|except|finally|import|from|as|with|for|while|in|not|and|or|True|False|None|self)\b/g },
    { type: 'decorator', regex: /@\w+/g },
    { type: 'method', regex: /\b(path|url|include|views|urlpatterns)\b/g },
    { type: 'object', regex: /\b(User|request|HttpResponse|JsonResponse)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  rails: [
    { type: 'comment', regex: /(#.*$)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*")/g },
    { type: 'keyword', regex: /\b(do|end|def|class|module|return|if|else|elsif|begin|rescue|require|include|extend)\b/g },
    { type: 'method', regex: /\b(get|post|put|patch|delete|resources|resource|root|namespace)\b/g },
    { type: 'object', regex: /\b(Rails|app|controller|params|render|redirect_to)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  gin: [
    { type: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm },
    { type: 'string', regex: /("[^"]*")/g },
    { type: 'keyword', regex: /\b(package|import|func|return|if|else|for|range|var|const|type|struct|interface|go|defer|chan|map|make|new|true|false|nil)\b/g },
    { type: 'method', regex: /\b(GET|POST|PUT|PATCH|DELETE|Group|Default|New|Run|JSON|Param|Query)\b/g },
    { type: 'object', regex: /\b(r|gin|c|context|http|Error)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  spring: [
    { type: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm },
    { type: 'string', regex: /("[^"]*")/g },
    { type: 'keyword', regex: /\b(public|private|protected|class|interface|return|if|else|for|while|try|catch|throw|new|import|package|static|final|void|abstract|extends|implements|super|this|null|true|false|@)\b/g },
    { type: 'decorator', regex: /@\w+/g },
    { type: 'method', regex: /\b(GetMapping|PostMapping|PutMapping|DeleteMapping|RequestMapping|RestController|Controller|RequestBody|PathVariable|RequestParam|ResponseEntity|HttpStatusCode)\b/g },
    { type: 'object', regex: /\b(User|ResponseEntity|HttpStatus|Long|String|Integer)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  laravel: [
    { type: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/|#\[)/gm },
    { type: 'string', regex: /('[^']*'|"[^"]*")/g },
    { type: 'keyword', regex: /\b(use|namespace|class|public|private|protected|function|return|if|else|elseif|foreach|while|try|catch|throw|new|static|self|this|null|true|false|array|class)\b/g },
    { type: 'decorator', regex: /@\w+/g },
    { type: 'method', regex: /\b(get|post|put|patch|delete|resource|apiResource|Route|route)\b/g },
    { type: 'object', regex: /\b(User|request|response|Route|Controller|Model)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
  aspnet: [
    { type: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm },
    { type: 'string', regex: /("[^"]*")/g },
    { type: 'keyword', regex: /\b(public|private|protected|class|interface|return|if|else|for|while|try|catch|throw|new|using|namespace|static|void|abstract|virtual|override|async|await|null|true|false|var|int|string|bool|long)\b/g },
    { type: 'decorator', regex: /\[[\w]+(?:\([^)]*\))?\]/g },
    { type: 'method', regex: /\b(Get|Post|Put|Delete|Patch|HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch|ApiController|Route|FromBody|FromRoute|FromQuery|Ok|NotFound|CreatedAtAction|NoContent|StatusCode)\b/g },
    { type: 'object', regex: /\b(User|IActionResult|ActionResult|ResponseEntity|HttpStatusCode)\b/g },
    { type: 'number', regex: /\b(\d+)\b/g },
  ],
};

const STYLES = {
  comment: 'color:#71717a;font-style:italic',
  string: 'color:#34d399',
  keyword: 'color:#c084fc;font-weight:600',
  decorator: 'color:#f472b6;font-weight:600',
  method: 'color:#38bdf8;font-weight:600',
  object: 'color:#fcd34d',
  arrow: 'color:#f472b6;font-weight:600',
  number: 'color:#fb923c',
  plain: 'color:#d4d4d8',
};

const LANGUAGE_LABELS = {
  express: 'Express.js',
  flask: 'Flask',
  fastapi: 'FastAPI',
  django: 'Django',
  rails: 'Ruby on Rails',
  gin: 'Go (Gin)',
  spring: 'Java (Spring)',
  laravel: 'PHP (Laravel)',
  aspnet: 'C# (ASP.NET)',
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code, language) {
  if (!code) return '';

  const tokens = LANGUAGE_TOKENS[language] || LANGUAGE_TOKENS.express;
  const matched = [];
  const used = new Set();

  for (const { type, regex } of tokens) {
    const re = new RegExp(regex.source, regex.flags);
    let m;
    while ((m = re.exec(code)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      let overlaps = false;
      for (let i = start; i < end; i++) {
        if (used.has(i)) { overlaps = true; break; }
      }
      if (!overlaps) {
        matched.push({ type, start, end, text: m[0] });
        for (let i = start; i < end; i++) used.add(i);
      }
    }
  }

  matched.sort((a, b) => a.start - b.start);

  let result = '';
  let pos = 0;

  for (const tok of matched) {
    if (tok.start > pos) {
      result += `<span style="${STYLES.plain}">${escapeHtml(code.slice(pos, tok.start))}</span>`;
    }
    result += `<span style="${STYLES[tok.type]}">${escapeHtml(tok.text)}</span>`;
    pos = tok.end;
  }

  if (pos < code.length) {
    result += `<span style="${STYLES.plain}">${escapeHtml(code.slice(pos))}</span>`;
  }

  return result;
}

export default function CodeEditor({ value, onChange, language = null }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const highlighted = useMemo(() => highlightCode(value, language), [value, language]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = value.substring(0, start) + text + value.substring(end);
    onChange(next);
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + text.length; }, 0);
  }, [value, onChange]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">{LANGUAGE_LABELS[language] || 'Code'}</span>
        </div>
        {value && (
          <button
            onClick={() => { onChange(''); textareaRef.current?.focus(); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      <div className={`flex-1 relative ${focused ? 'ring-2 ring-purple-500/50 ring-inset' : ''}`}>
        <div
          ref={highlightRef}
          className="absolute inset-0 overflow-auto bg-zinc-900 pointer-events-none"
          aria-hidden="true"
        >
          <pre
            className="p-4 m-0 font-mono text-sm leading-6 whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onScroll={handleScroll}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={language ? `Paste your ${LANGUAGE_LABELS[language] || language} code here...` : 'Paste your code here...'}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-purple-400 font-mono text-sm p-4 outline-none leading-6 caret-blink"
        />
      </div>
    </div>
  );
}
