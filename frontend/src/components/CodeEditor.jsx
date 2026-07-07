import { useState } from 'react';
import { Code2 } from 'lucide-react';

export default function CodeEditor({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <Code2 size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-zinc-300">Express Code</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={`Paste your Express.js routes here...\n\nExample:\napp.get('/api/v1/users', (req, res) => { ... });\napp.post('/api/v1/users', (req, res) => { ... });`}
        className={`flex-1 w-full resize-none bg-zinc-900 text-zinc-100 font-mono text-sm p-4 outline-none placeholder:text-zinc-600 ${
          focused ? 'ring-2 ring-purple-500/50' : ''
        }`}
      />
    </div>
  );
}
