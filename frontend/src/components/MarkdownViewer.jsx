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
        <Markdown
          className="prose prose-invert prose-zinc max-w-none
            prose-headings:text-zinc-100 prose-headings:font-bold
            prose-h1:text-2xl prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-zinc-700
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-purple-400
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-zinc-200
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-zinc-100
            prose-code:text-purple-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-li:text-zinc-300 prose-li:marker:text-purple-500
            prose-table:w-full prose-table:border-collapse
            prose-thead:border-b prose-thead:border-zinc-700
            prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-zinc-200 prose-th:py-2 prose-th:px-3
            prose-td:text-sm prose-td:text-zinc-300 prose-td:py-2 prose-td:px-3 prose-td:border-b prose-td:border-zinc-800
            prose-tr:hover:prose-td:bg-zinc-800/50
            prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-lg prose-pre:p-4
            prose-blockquote:border-l-purple-500 prose-blockquote:bg-zinc-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
        >
          {content}
        </Markdown>
      </div>

      {/* Floating Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-purple-600 text-white text-sm font-medium shadow-lg shadow-purple-600/30
          hover:bg-purple-500 hover:shadow-purple-500/40
          active:scale-95 transition-all duration-200"
      >
        {copied ? (
          <>
            <Check size={16} />
            Copiado!
          </>
        ) : (
          <>
            <Copy size={16} />
            Copiar Markdown
          </>
        )}
      </button>
    </div>
  );
}
