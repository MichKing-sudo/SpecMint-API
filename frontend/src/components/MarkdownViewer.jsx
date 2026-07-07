import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

function normalizeMarkdown(markdownFromServer) {
  if (typeof markdownFromServer !== 'string') return '';
  return markdownFromServer
    .replace(/\\n/g, '\n')
    .replace(/\n{2,}/g, '\n\n');
}

function extractMethod(text) {
  const match = String(text).match(/^(GET|POST|PUT|PATCH|DELETE)$/i);
  return match ? match[1].toUpperCase() : null;
}

const METHOD_BADGE_STYLES = {
  GET: 'inline-block px-2.5 py-0.5 rounded text-xs font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'inline-block px-2.5 py-0.5 rounded text-xs font-bold border bg-sky-500/20 text-sky-400 border-sky-500/30',
  PUT: 'inline-block px-2.5 py-0.5 rounded text-xs font-bold border bg-amber-500/20 text-amber-400 border-amber-500/30',
  PATCH: 'inline-block px-2.5 py-0.5 rounded text-xs font-bold border bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELETE: 'inline-block px-2.5 py-0.5 rounded text-xs font-bold border bg-red-500/20 text-red-400 border-red-500/30',
};

function MethodBadgeInline({ method }) {
  const style = METHOD_BADGE_STYLES[method] || METHOD_BADGE_STYLES.GET;
  return <span className={style}>{method}</span>;
}

function normalizeMarkdownForTable(markdownFromServer) {
  if (typeof markdownFromServer !== 'string') return '';
  return markdownFromServer
    .replace(/\\r\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function fixTableFormat(md) {
  const lines = md.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.includes('|') && !line.trim().startsWith('```')) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|') && !lines[i].trim().startsWith('```')) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const cleaned = tableLines.map(l =>
          l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()).filter(Boolean)
        );

        const isSeparator = cleaned.every(cells =>
          cells.every(c => /^[-:]+$/.test(c))
        );

        if (isSeparator && cleaned.length === 1) {
          i--;
          continue;
        }

        if (cleaned.length >= 2) {
          let header = cleaned[0];
          let startIdx = 0;

          if (cleaned.length > 1 && cleaned[1].every(c => /^[-:]+$/.test(c))) {
            startIdx = 1;
          }

          const rows = cleaned.slice(startIdx);

          if (header.length === 3) {
            const hasMethod = header.some(h => /method/i.test(h));
            const hasPath = header.some(h => /path/i.test(h));
            const hasDescription = header.some(h => /desc/i.test(h));

            if (hasMethod && hasPath) {
              let fixedTable = '| Method | Path' + (hasDescription ? ' | Description' : '') + ' |\n';
              fixedTable += '|---|---' + (hasDescription ? '|---' : '') + '|\n';

              for (const row of rows) {
                if (row.every(c => /^[-:]+$/.test(c))) continue;
                const padded = row.map(c => c || '').slice(0, header.length);
                while (padded.length < header.length) padded.push('');
                fixedTable += '| ' + padded.join(' | ') + ' |\n';
              }

              result.push(fixedTable);
              continue;
            }
          }

          let table = '| ' + header.join(' | ') + ' |\n';
          table += '| ' + header.map(() => '---').join(' | ') + ' |\n';
          for (const row of rows) {
            if (row.every(c => /^[-:]+$/.test(c))) continue;
            const padded = row.map(c => c || '').slice(0, header.length);
            while (padded.length < header.length) padded.push('');
            table += '| ' + padded.join(' | ') + ' |\n';
          }

          result.push(table);
          continue;
        }
      }
      i--;
    }

    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

const mdComponents = {
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-700/50">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-800/80 border-b border-zinc-700/50">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-zinc-700/30">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="table-row hover:bg-zinc-800/40 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-xs font-semibold text-zinc-300 uppercase tracking-wider">{children}</th>
  ),
  td: ({ children }) => {
    const text = String(children).trim();
    const method = extractMethod(text);
    if (method) {
      return (
        <td className="px-4 py-3">
          <span className={METHOD_BADGE_STYLES[method]}>{method}</span>
        </td>
      );
    }
    return <td className="px-4 py-3 text-zinc-300">{children}</td>;
  },
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-zinc-100 mb-4 mt-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-zinc-200 mb-3 mt-6 pb-2 border-b border-zinc-700/50">{children}</h2>
  ),
  h3: ({ children }) => {
    const text = String(children);
    const methodMatch = text.match(/(GET|POST|PUT|PATCH|DELETE)/i);
    if (methodMatch) {
      const method = methodMatch[1].toUpperCase();
      const path = text.replace(method, '').replace(/[`*]/g, '').trim();
      return (
        <h3 className="flex items-center gap-3 text-base font-semibold text-zinc-100 mb-2 mt-6 p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
          <span className={METHOD_BADGE_STYLES[method]}>{method}</span>
          <code className="text-purple-300 font-mono text-sm">{path}</code>
        </h3>
      );
    }
    return <h3 className="text-base font-semibold text-zinc-200 mb-2 mt-4">{children}</h3>;
  },
  p: ({ children }) => (
    <p className="text-zinc-400 text-sm leading-relaxed mb-3">{children}</p>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-purple-300 text-xs font-mono">{children}</code>
      );
    }
    return (
      <pre className="my-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto">
        <code className="text-xs font-mono text-zinc-300 leading-relaxed">{children}</code>
      </pre>
    );
  },
  ul: ({ children }) => (
    <ul className="list-none space-y-1.5 mb-3 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 mb-3 ml-4 text-zinc-400 text-sm">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-zinc-400 before:content-['•'] before:mr-2 before:text-purple-400">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-200">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-zinc-400">{children}</em>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">{children}</a>
  ),
  hr: () => (
    <hr className="my-6 border-zinc-700/50" />
  ),
  blockquote: ({ children }) => (
    <blockquote className="pl-4 border-l-2 border-purple-500/50 text-zinc-400 italic my-3">{children}</blockquote>
  ),
};

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

  let formattedMarkdown = normalizeMarkdownForTable(content);
  formattedMarkdown = fixTableFormat(formattedMarkdown);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <FileText size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-zinc-300">Documentation Output</span>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-zinc-900 markdown-body">
        <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {formattedMarkdown}
        </Markdown>
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
