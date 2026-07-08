import { useState, useEffect, useRef } from 'react';
import { Loader2, Zap, Trash2 } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import MarkdownViewer from './components/MarkdownViewer';
import LanguageSelector from './components/LanguageSelector';

const SAMPLE_CODES = {
  express: `const express = require('express');
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

module.exports = router;`,

  flask: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/v1/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({"success": True, "data": [u.to_dict() for u in users]})

@app.route('/api/v1/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "data": user.to_dict()}), 201

@app.route('/api/v1/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"success": True, "data": user.to_dict()})

@app.route('/api/v1/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify({"success": True, "data": user.to_dict()})

@app.route('/api/v1/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204`,

  fastapi: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: str

@app.get("/api/v1/users")
async def get_users():
    users = await User.all()
    return {"success": True, "data": users}

@app.post("/api/v1/users", status_code=201)
async def create_user(user: UserCreate):
    new_user = await User.create(**user.dict())
    return {"success": True, "data": new_user}

@app.get("/api/v1/users/{user_id}")
async def get_user(user_id: int):
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True, "data": user}

@app.put("/api/v1/users/{user_id}")
async def update_user(user_id: int, user: UserCreate):
    existing = await User.get_or_none(id=user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    await existing.update_from_dict(user.dict())
    await existing.save()
    return {"success": True, "data": existing}

@app.delete("/api/v1/users/{user_id}")
async def delete_user(user_id: int):
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    await user.delete()
    return None, 204`,

  django: `from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/users', views.user_list, name='user-list'),
    path('api/v1/users/<int:pk>', views.user_detail, name='user-detail'),
    path('api/v1/posts', views.post_list, name='post-list'),
]`,

  rails: `Rails.application.routes.draw do
  get 'api/v1/users', to: 'users#index'
  post 'api/v1/users', to: 'users#create'
  get 'api/v1/users/:id', to: 'users#show'
  put 'api/v1/users/:id', to: 'users#update'
  delete 'api/v1/users/:id', to: 'users#destroy'
end`,

  gin: `package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    r.GET("/api/v1/users", getUsers)
    r.POST("/api/v1/users", createUser)
    r.GET("/api/v1/users/:id", getUser)
    r.PUT("/api/v1/users/:id", updateUser)
    r.DELETE("/api/v1/users/:id", deleteUser)

    r.Run(":8080")
}`,

  spring: `@RestController
@RequestMapping("/api/v1")
public class UserController {

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(201).body(userService.create(user));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,

  laravel: `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/api/v1/users', [UserController::class, 'index']);
Route::post('/api/v1/users', [UserController::class, 'store']);
Route::get('/api/v1/users/{id}', [UserController::class, 'show']);
Route::put('/api/v1/users/{id}', [UserController::class, 'update']);
Route::delete('/api/v1/users/{id}', [UserController::class, 'destroy']);`,

  aspnet: `[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(_service.GetAll());
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] User user)
    {
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, _service.Create(user));
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        var user = _service.GetById(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User user)
    {
        var updated = _service.Update(id, user);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        _service.Delete(id);
        return NoContent();
    }
}`,
};

const LANGUAGES = [
  { id: 'express', name: 'Express.js' },
  { id: 'flask', name: 'Flask' },
  { id: 'fastapi', name: 'FastAPI' },
  { id: 'django', name: 'Django' },
  { id: 'rails', name: 'Ruby on Rails' },
  { id: 'gin', name: 'Go (Gin)' },
  { id: 'spring', name: 'Java (Spring)' },
  { id: 'laravel', name: 'PHP (Laravel)' },
  { id: 'aspnet', name: 'C# (ASP.NET)' },
];

const LANG_PATTERNS = {
  express: [/require\s*\(\s*['"]express['"]\s*\)/i, /import\s+.*from\s+['"]express['"]/i, /\bapp\.(get|post|put|patch|delete)\s*\(/i, /\brouter\.(get|post|put|patch|delete)\s*\(/i],
  flask: [/from\s+flask\s+import/i, /@app\.route\s*\(/i, /@blueprint\.route\s*\(/i],
  fastapi: [/from\s+fastapi\s+import/i, /@app\.(get|post|put|patch|delete)\s*\(/i, /APIRouter\s*\(/i],
  django: [/from\s+django\.conf\.urls\s+import/i, /from\s+django\.urls\s+import\s+path/i, /urlpatterns\s*=/i],
  rails: [/Rails\.application\.routes/i, /\b(get|post|put|patch|delete)\s+['"]/i, /resources?\s+:/i],
  gin: [/gin\.Default\s*\(\)/i, /gin\.New\s*\(\)/i, /\.(GET|POST|PUT|PATCH|DELETE)\s*\(/i],
  spring: [/@RestController/i, /@RequestMapping/i, /@(Get|Post|Put|Delete|Patch)Mapping/i],
  laravel: [/Route::(get|post|put|patch|delete)\s*\(/i, /use\s+Illuminate\\Support\\Facades\\Route/i],
  aspnet: [/\[HttpGet\s*\]/i, /\[HttpPost\s*\]/i, /\[HttpPut\s*\]/i, /\[HttpDelete\s*\]/i, /\[ApiController\]/i],
};

function detectLanguage(code) {
  if (!code || code.trim().length < 10) return null;
  const scores = {};
  for (const [key, patterns] of Object.entries(LANG_PATTERNS)) {
    scores[key] = 0;
    for (const pattern of patterns) {
      if (pattern.test(code)) scores[key]++;
    }
  }
  let best = null;
  let bestScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) { bestScore = score; best = key; }
  }
  return bestScore > 0 ? best : null;
}

export default function App() {
  const [code, setCode] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const lastDetectedRef = useRef(null);

  useEffect(() => {
    if (!code || code.trim().length < 20) {
      lastDetectedRef.current = null;
      return;
    }
    const detected = detectLanguage(code);
    if (detected && detected !== lastDetectedRef.current) {
      lastDetectedRef.current = detected;
      setSelectedLanguage(detected);
    }
  }, [code]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Paste some code first');
      return;
    }

    setLoading(true);
    setError('');
    setMarkdown('');
    setDetectedLanguage(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }

      setMarkdown(data.markdown);
      if (data.detectedLanguage) {
        setDetectedLanguage(data.languageName);
      }
    } catch (err) {
      setError('Could not connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    const lang = selectedLanguage || 'express';
    setCode(SAMPLE_CODES[lang]);
    setMarkdown('');
    setError('');
    setDetectedLanguage(null);
    lastDetectedRef.current = null;
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
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
          <LanguageSelector
            languages={LANGUAGES}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />

          {code && (
            <button
              onClick={() => { setCode(''); setMarkdown(''); setError(''); setDetectedLanguage(null); setSelectedLanguage(null); lastDetectedRef.current = null; }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          )}

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

      {error && (
        <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {detectedLanguage && !error && (
        <div className="px-6 py-1.5 bg-purple-500/10 border-b border-purple-500/20 text-purple-300 text-xs">
          Detected: {detectedLanguage}
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 border-r border-zinc-800">
          <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
        </div>

        <div className="w-1/2">
          <MarkdownViewer content={markdown} loading={loading} />
        </div>
      </div>
    </div>
  );
}
