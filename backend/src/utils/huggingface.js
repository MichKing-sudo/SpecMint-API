const { HfInference } = require('@huggingface/inference');
const { getPrompt } = require('./prompts');
const { getLanguageName } = require('./languageDetector');

const hf = new HfInference(process.env.HF_API_KEY);

async function generateDocumentation(routes, fullCode, language) {
  const frameworkName = getLanguageName(language);
  const systemPrompt = getPrompt(language, frameworkName);

  const userMessage = `Here is the full ${frameworkName} source code:\n\n\`\`\`\n${fullCode}\n\`\`\``;

  const result = await hf.chatCompletion({
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 2048,
    temperature: 0.3,
  });

  return result.choices[0].message.content;
}

module.exports = { generateDocumentation };
