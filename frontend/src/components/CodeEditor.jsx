import { useState, useRef, useEffect, useCallback } from 'react';
import { Code2 } from 'lucide-react';

const KEYWORDS = /\b(const|let|var|function|async|await|return|if|else|try|catch|throw|new|module|exports|require)\b/g;
const METHODS = /\b(get|post|put|patch|delete|options|head)\b/g;
const STRINGS = /('[^']*'|"[^"]*"|`[^`]*`)/g;
const COMMENTS = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const NUMBERS = /\b(\d+)\b/g;
const OBJECTS = /\b(res|req|router|app|console|Error|JSON|Math|Date)\b/g;
const PROPS = /\.(\w+)\s*\(/g;
const ARROW = /=>/g;

function highlightCode(code) {
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(COMMENTS, '<span class="text-zinc-500 italic">$1</span>');
  html = html.replace(STRINGS, '<span class="text-emerald-400">$1</span>');
  html = html.replace(KEYWORDS, '<span class="text-purple-400 font-semibold">$1</span>');
  html = html.replace(METHODS, '<span class="text-sky-400 font-semibold uppercase tracking-wide">$1</span>');
  html = html.replace(OBJECTS, '<span class="text-amber-300">$1</span>');
  html = html.replace(PROPS, '.<span class="text-sky-300">$1</span>(');
  html = html.replace(ARROW, '<span class="text-pink-400 font-semibold">=&gt;</span>');
  html = html.replace(NUMBERS, '<span class="text-orange-400">$1</span>');

  return html;
}

export default function CodeEditor({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.addEventListener('scroll', syncScroll);
      return () => ta.removeEventListener('scroll', syncScroll);
    }
  }, [syncScroll]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <Code2 size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-zinc-300">Express Code</span>
      </div>
      <div className={`flex-1 relative ${focused ? 'ring-2 ring-purple-500/50 ring-inset' : ''}`}>
        <div
          ref={highlightRef}
          className="absolute inset-0 overflow-auto p-4 bg-zinc-900 font-mono text-sm whitespace-pre pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlightCode(value) + '\n' }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Paste your Express.js routes here...\n\nExample:\napp.get('/api/v1/users', (req, res) => { ... });\napp.post('/api/v1/users', (req, res) => { ... });`}
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-purple-400 font-mono text-sm p-4 outline-none caret-blink"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
