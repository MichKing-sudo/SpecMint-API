import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import MarkdownViewer from './components/MarkdownViewer';

const SAMPLE_CODE = `const express = require('express');
const router = express.Router();

router.get('/api/v1/users', async (req, res) => {
  const users = await User.findAll();
  res.json({ success: true, data: users });
});

router.post('/api/v1/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

router.get('/api/v1/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: user });
});

router.put('/api/v1/users/:id', async (req, res) => {
  const user = await User.update(req.params.id, req.body);
  res.json({ success: true, data: user });
});

router.delete('/api/v1/users/:id', async (req, res) => {
  await User.delete(req.params.id);
  res.status(204).send();
});

router.get('/api/v1/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json({ success: true, data: posts });
});

router.post('/api/v1/posts', async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

module.exports = router;`;

export default function App() {
  const [code, setCode] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Paste some Express code first');
      return;
    }

    setLoading(true);
    setError('');
    setMarkdown('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }

      setMarkdown(data.markdown);
    } catch (err) {
      setError('Could not connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE);
    setMarkdown('');
    setError('');
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">SpecMint</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            API
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadSample}
            className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Load Sample
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={14} />
                Generate Docs
              </>
            )}
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Split Pane */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-zinc-800">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        {/* Right: Viewer */}
        <div className="w-1/2">
          <MarkdownViewer content={markdown} loading={loading} />
        </div>
      </div>
    </div>
  );
}
