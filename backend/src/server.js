require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeCode } = require('./controllers/analyzeController');
const { getSupportedLanguages } = require('./utils/languageDetector');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/languages', (_req, res) => res.json(getSupportedLanguages()));

app.post('/api/analyze', analyzeCode);

app.listen(PORT, () => {
  console.log(`SpecMint API running on http://localhost:${PORT}`);
});
