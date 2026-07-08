const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getPrompt } = require('./prompts');
const { getLanguageName } = require('./languageDetector');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateDocumentation(routes, fullCode, language) {
  const frameworkName = getLanguageName(language);
  const systemPrompt = getPrompt(language, frameworkName);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const routeSummary = routes
    .map(r => `${r.method} ${r.path}`)
    .join('\n');

  const prompt = `${systemPrompt}\n\nHere are the extracted routes:\n${routeSummary}\n\nHere is the full source code:\n\n\`\`\`\n${fullCode}\n\`\`\``;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { generateDocumentation };
