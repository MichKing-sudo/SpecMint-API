import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

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

  const rendered = renderMarkdown(content);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <FileText size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-zinc-300">Documentation Output</span>
      </div>

      <div
        className="flex-1 overflow-auto p-6 bg-zinc-900 markdown-body"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />

      <button
        onClick={handleCopy}
        className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600 text-white text-sm font-medium shadow-lg hover:bg-purple-500 active:scale-95 transition-all"
      >
        {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Markdown</>}
      </button>
    </div>
  );
}

function renderMarkdown(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
    const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Bold and inline code
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs
  html = html.replace(/^(?!<[huptl]|<li|<hr|<table|<pre)(.+)$/gm, '<p>$1</p>');

  return html;
}
