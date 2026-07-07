const { extractRoutes } = require('../utils/extractor');
const { generateDocumentation } = require('../utils/huggingface');

async function analyzeCode(req, res) {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'No code provided' });
    }

    const routes = extractRoutes(code);

    if (routes.length === 0) {
      return res.status(400).json({
        error: 'No Express routes found in the provided code',
        hint: 'Make sure your code contains valid app.get(), app.post(), router.get(), etc. calls',
      });
    }

    const markdown = await generateDocumentation(routes);

    res.json({ routes, markdown });
  } catch (err) {
    console.error('Analysis error:', err.message);

    if (err.message.includes('API_KEY_INVALID')) {
      return res.status(500).json({ error: 'Invalid Gemini API key. Check your GEMINI_API_KEY environment variable.' });
    }

    if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ error: 'Could not reach Gemini API. Check your network and GEMINI_API_KEY.' });
    }
    res.status(500).json({ error: `Failed to generate documentation: ${err.message}` });
  }
}

module.exports = { analyzeCode };
