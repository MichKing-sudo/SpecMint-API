const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `You are a technical documentation generator. You will receive a list of API routes extracted from an Express.js codebase.

For each route, generate clean Markdown documentation using this exact format:

# API Documentation

## Endpoints

| Method | Path | Description |
|--------|------|-------------|

Then for each route, create a section:

### \`METHOD /path\`

**Description:** (write a clear, concise description of what this endpoint likely does based on its path)

**Parameters:**
- List any obvious query params, path params, or body fields inferred from the path structure

**Example Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

---

Rules:
- Use strict Markdown table format for the summary
- Generate meaningful descriptions based on the route paths
- Be concise but informative
- Always include the method in uppercase
- Group routes logically by their base path`;

async function generateDocumentation(routes) {
  const routeSummary = routes
    .map(r => `${r.method} ${r.path}`)
    .join('\n');

  const result = await hf.chatCompletion({
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Here are the extracted routes:\n${routeSummary}` },
    ],
    max_tokens: 2048,
    temperature: 0.3,
  });

  return result.choices[0].message.content;
}

module.exports = { generateDocumentation };
