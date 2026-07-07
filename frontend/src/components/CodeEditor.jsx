import { useState, useRef, useCallback } from 'react';
import { Code2, Trash2 } from 'lucide-react';

const TOKENS = [
  { type: 'comment',  regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm },
  { type: 'string',   regex: /('[^']*'|"[^"]*"|`[^`]*`)/g },
  { type: 'keyword',  regex: /\b(const|let|var|function|async|await|return|if|else|try|catch|throw|new|module|exports|require)\b/g },
  { type: 'method',   regex: /\b(get|post|put|patch|delete|options|head)\b/g },
  { type: 'object',   regex: /\b(res|req|router|app|console|Error|JSON|Math|Date)\b/g },
  { type: 'arrow',    regex: /=>/g },
  { type: 'number',   regex: /\b(\d+)\b/g },
];

const STYLES = {
  comment:  'color:#71717a;font-style:italic',
  string:   'color:#34d399',
  keyword:  'color:#c084fc;font-weight:600',
  method:   'color:#38bdf8;font-weight:600',
  object:   'color:#fcd34d',
  arrow:    'color:#f472b6;font-weight:600',
  number:   'color:#fb923c',
  plain:    'color:#d4d4d8',
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code) {
  if (!code) return '';

  const tokens = [];
  const used = new Set();

  for (const { type, regex } of TOKENS) {
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
        tokens.push({ type, start, end, text: m[0] });
        for (let i = start; i < end; i++) used.add(i);
      }
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  let result = '';
  let pos = 0;

  for (const tok of tokens) {
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

export default function CodeEditor({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

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
          <span className="text-sm font-medium text-zinc-300">Express Code</span>
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
            dangerouslySetInnerHTML={{ __html: highlightCode(value) }}
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
          placeholder={"Paste your Express.js routes here...\n\nExample:\napp.get('/api/v1/users', (req, res) => { ... });\napp.post('/api/v1/users', (req, res) => { ... });"}
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
