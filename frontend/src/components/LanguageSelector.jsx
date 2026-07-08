import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { getLanguageLogo } from './LanguageLogos';

export default function LanguageSelector({ languages, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = languages.find(l => l.id === value);
  const Logo = value ? getLanguageLogo(value) : null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-md border border-zinc-700 outline-none hover:border-zinc-500 cursor-pointer transition-colors"
      >
        {Logo ? <Logo size={16} /> : <Globe size={16} className="text-zinc-400" />}
        <span>{selected?.name || 'Auto-detect'}</span>
        <ChevronDown size={12} className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 py-1">
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
              value === null
                ? 'bg-purple-600/20 text-purple-300'
                : 'text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Globe size={16} className="text-zinc-400" />
            <span>Auto-detect</span>
          </button>
          {languages.map(lang => {
            const LangLogo = getLanguageLogo(lang.id);
            return (
              <button
                key={lang.id}
                onClick={() => { onChange(lang.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                  value === lang.id
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <LangLogo size={16} />
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
