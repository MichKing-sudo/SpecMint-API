import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

const METHOD_COLORS = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PATCH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function MethodBadge({ method }) {
  const colors = METHOD_COLORS[method] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${colors}`}>
      {method}
    </span>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-zinc-700/50 rounded" />

      <div className="mt-6 border border-zinc-700/50 rounded-lg overflow-hidden">
        <div className="bg-zinc-800/50 px-4 py-3 flex gap-8">
          <div className="h-4 w-16 bg-zinc-600/50 rounded" />
          <div className="h-4 w-48 bg-zinc-600/50 rounded" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="px-4 py-3 flex gap-8 border-t border-zinc-700/30">
            <div className="h-4 w-12 bg-zinc-700/40 rounded" />
            <div className="h-4 w-40 bg-zinc-700/40 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="border border-zinc-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-14 bg-zinc-600/50 rounded" />
              <div className="h-5 w-40 bg-zinc-600/50 rounded" />
            </div>
            <div className="h-4 w-3/4 bg-zinc-700/30 rounded" />
            <div className="h-20 w-full bg-zinc-700/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderMarkdown(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');

  // Tables - wrap in card-like container
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
    const headers = header.split('|').filter(c => c.trim()).map(c => {
      const trimmed = c.trim();
      const methodMatch = trimmed.match(/^(GET|POST|PUT|PATCH|DELETE)$/i);
      if (methodMatch) {
        return `<th class="method-header" data-method="${methodMatch[1].toUpperCase()}">${methodMatch[1].toUpperCase()}</th>`;
      }
      return `<th>${trimmed}</th>`;
    }).join('');
    const rows = body.trim().split('\n').map((row, i) => {
      const cells = row.split('|').filter(c => c.trim()).map(c => {
        const trimmed = c.trim();
        const methodMatch = trimmed.match(/^(GET|POST|PUT|PATCH|DELETE)$/i);
        if (methodMatch) {
          return `<td><span class="method-badge" data-method="${methodMatch[1].toUpperCase()}">${methodMatch[1].toUpperCase()}</span></td>`;
        }
        return `<td>${trimmed}</td>`;
      }).join('');
      return `<tr class="table-row" data-index="${i}">${cells}</tr>`;
    }).join('');
    return `<div class="table-wrapper"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Headings
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const methodMatch = text.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/i);
    if (methodMatch) {
      return `<div class="endpoint-card" id="endpoint-${methodMatch[2].replace(/[^a-zA-Z0-9]/g, '-')}"><h3 class="endpoint-title"><span class="method-badge" data-method="${methodMatch[1].toUpperCase()}">${methodMatch[1].toUpperCase()}</span> <code class="endpoint-path">${methodMatch[2]}</code></h3>`;
    }
    return `<h3>${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Close endpoint cards before next h2 or h3
  html = html.replace(/(<div class="endpoint-card".*?<\/h3>)/g, '$1<div class="endpoint-body">');
  html = html.replace(/(<h[23]>)/g, '</div></div>$1');
  html = html.replace(/(<h2>)/g, '</div></div>$1');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Bold and inline code
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs
  html = html.replace(/^(?!<[huptld]|<li|<hr|<table|<pre|<div|<\/)(.+)$/gm, '<p>$1</p>');

  return html;
}

export default function MarkdownViewer({ content, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
          <FileText size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-zinc-300">Documentation Output</span>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-zinc-900">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

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
