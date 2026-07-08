const { extractRoutes } = require('../utils/extractor');
const { generateDocumentation } = require('../utils/huggingface');
const { generateDocumentation: generateGeminiDocumentation } = require('../utils/gemini');
const { detectLanguage, getLanguageName, getSupportedLanguages } = require('../utils/languageDetector');

function sanitizeMarkdown(aiResponse) {
  if (!aiResponse) return '';

  let clean = aiResponse;

  // 1. Forzar que los bloques de código vacíos o planos tengan la etiqueta "json"
  clean = clean.replace(/```\n([\s\S]*?```)/g, '```json\n$1');

  // 2. Corregir booleanos de Python dentro de los bloques de código del Markdown
  clean = clean.replace(/: True/g, ': true').replace(/: False/g, ': false');

  // 3. Corregir None a null
  clean = clean.replace(/: None/g, ': null');

  return clean;
}

async function analyzeCode(req, res) {
  try {
    const { code, language: forcedLanguage } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'No code provided' });
    }

    const language = forcedLanguage || detectLanguage(code);

    if (!language) {
      return res.status(400).json({
        error: 'Could not detect programming language',
        hint: 'Please specify the language or use a supported framework',
        supportedLanguages: getSupportedLanguages(),
      });
    }

    const routes = extractRoutes(code, language);

    if (routes.length === 0) {
      const langName = getLanguageName(language);
      return res.status(400).json({
        error: `No routes found in the provided ${langName} code`,
        hint: `Make sure your code contains valid route definitions for ${langName}`,
        detectedLanguage: language,
      });
    }

    let markdown;

    const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
    const hasHfKey = process.env.HF_API_KEY && process.env.HF_API_KEY.trim().length > 0;

    if (hasGeminiKey) {
      markdown = await generateGeminiDocumentation(routes, code, language);
    } else if (hasHfKey) {
      markdown = await generateDocumentation(routes, code, language);
    } else {
      return res.status(500).json({ error: 'No AI API key configured. Set GEMINI_API_KEY or HF_API_KEY.' });
    }

    // Sanitizar el markdown antes de enviarlo
    markdown = sanitizeMarkdown(markdown);

    res.json({
      routes,
      markdown,
      detectedLanguage: language,
      languageName: getLanguageName(language),
    });
  } catch (err) {
    console.error('Analysis error:', err.message);

    if (err.message.includes('API_KEY_INVALID')) {
      return res.status(500).json({ error: 'Invalid API key. Check your GEMINI_API_KEY or HF_API_KEY environment variable.' });
    }

    if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ error: 'Could not reach AI API. Check your network and API keys.' });
    }
    res.status(500).json({ error: `Failed to generate documentation: ${err.message}` });
  }
}

module.exports = { analyzeCode };
