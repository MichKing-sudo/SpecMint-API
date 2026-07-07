import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';

export default function MarkdownViewer({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
          <FileText size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Documentation Output</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          Generated Markdown will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <FileText size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-zinc-300">Documentation Output</span>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-zinc-900">
        <Markdown className="markdown-body">{content}</Markdown>
      </div>

      <button
        onClick={handleCopy}
        className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600 text-white text-sm font-medium shadow-lg hover:bg-purple-500 active:scale-95 transition-all"
      >
        {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Markdown</>}
      </button>
    </div>
  );
}
