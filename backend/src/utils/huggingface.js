const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `You are a technical documentation generator. You will receive the FULL Express.js source code of a backend.

Your task: analyze the code and generate Markdown documentation.

## Output Format

# API Documentation

## Endpoints

| Method | Path |
|--------|------|

Then for each route:

### \`METHOD /path\`

**Parameters:**
- List ALL parameters: req.params (path params), req.query (query params), and req.body fields

**Example Response:**
\`\`\`json
(real JSON from the res.json() call in the code)
\`\`\`

**Error Response:**
\`\`\`json
(real JSON from error cases like res.status(4xx).json())
\`\`\`

---

## STRICT RULES

1. PROHIBIDO usar marcadores de posición como {} vacíos o respuestas genéricas.
2. You MUST read the FULL source code block. Extract EVERY parameter from req.params, req.query, and req.body.
3. You MUST replicate EXACTLY the real JSON objects found inside res.json() and res.status().json() calls in the code.
4. If the code has res.status(201).json({ success: true, data: user }), your example MUST show exactly that.
5. If the code has res.status(404).json({ error: 'Not found' }), your error response MUST show exactly that.
6. If a route has no error handling in the code, omit the Error Response section.
7. Always include the method in uppercase in the table.
8. Group routes logically by their base path.`;

async function generateDocumentation(routes, fullCode) {
  const userMessage = `Here is the full Express.js source code:\n\n\`\`\`javascript\n${fullCode}\n\`\`\``;

  const result = await hf.chatCompletion({
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 2048,
    temperature: 0.3,
  });

  return result.choices[0].message.content;
}

module.exports = { generateDocumentation };
