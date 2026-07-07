import { useState, useRef, useCallback } from 'react';
import { Code2, Trash2 } from 'lucide-react';

const KEYWORDS = /\b(const|let|var|function|async|await|return|if|else|try|catch|throw|new|module|exports|require)\b/g;
const METHODS = /\b(get|post|put|patch|delete|options|head)\b/g;
const STRINGS = /('[^']*'|"[^"]*"|`[^`]*`)/g;
const COMMENTS = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const NUMBERS = /\b(\d+)\b/g;
const OBJECTS = /\b(res|req|router|app|console|Error|JSON|Math|Date)\b/g;
const PROPS = /\.(\w+)\s*\(/g;
const ARROW = /=>/g;

function highlightCode(code) {
  if (!code) return '';
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(COMMENTS, '<span style="color:#71717a;font-style:italic">$1</span>');
  html = html.replace(STRINGS, '<span style="color:#34d399">$1</span>');
  html = html.replace(KEYWORDS, '<span style="color:#c084fc;font-weight:600">$1</span>');
  html = html.replace(METHODS, '<span style="color:#38bdf8;font-weight:600">$1</span>');
  html = html.replace(OBJECTS, '<span style="color:#fcd34d">$1</span>');
  html = html.replace(PROPS, '.<span style="color:#7dd3fc">$1</span>(');
  html = html.replace(ARROW, '<span style="color:#f472b6;font-weight:600">=&gt;</span>');
  html = html.replace(NUMBERS, '<span style="color:#fb923c">$1</span>');

  return html;
}

export default function CodeEditor({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  }, [value, onChange]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Express Code</span>
        </div>
        {value && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      <div className={`flex-1 relative ${focused ? 'ring-2 ring-purple-500/50 ring-inset' : ''}`}>
        {/* Highlight layer */}
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

        {/* Input layer */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onScroll={handleScroll}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Paste your Express.js routes here...\n\nExample:\napp.get('/api/v1/users', (req, res) => { ... });\napp.post('/api/v1/users', (req, res) => { ... });`}
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
