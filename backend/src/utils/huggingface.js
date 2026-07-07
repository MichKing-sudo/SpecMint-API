const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `You are a technical documentation generator. You will receive the FULL Express.js source code of a backend.

Your task: analyze the code and generate Markdown documentation.

## Output Format

# API Documentation

## Endpoints

Generate the endpoint summary table using EXACTLY this GitHub-flavored Markdown pipe format. Each row MUST be on its own real newline. Tables MUST NOT break across lines or collapse into a single line.

| Method | Path | Description |
|---|---|---|
| GET | /api/v1/users | List all users |
| POST | /api/v1/users | Create a new user |

Then for each route:

### \`METHOD /path\`

**Description:** (write a clear, concise description of what this endpoint does)

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

1. Generate the table using EXACTLY this pipe format: | Method | Path | Description | with separator |---|---|---|. Each row MUST start on a new line. NEVER collapse the table into a single line.
2. PROHIBIDO usar marcadores de posición como {} vacíos o respuestas genéricas.
3. You MUST read the FULL source code block. Extract EVERY parameter from req.params, req.query, and req.body.
4. You MUST replicate EXACTLY the real JSON objects found inside res.json() and res.status().json() calls in the code.
5. If the code has res.status(201).json({ success: true, data: user }), your example MUST show exactly that.
6. If the code has res.status(404).json({ error: 'Not found' }), your error response MUST show exactly that.
7. If a route has no error handling in the code, omit the Error Response section.
8. Always include the method in uppercase in the table.
9. Generate meaningful descriptions from the route paths and code logic.
10. Group routes logically by their base path.
11. Path parameters (req.params) MUST ONLY be listed for routes whose path contains a colon (:) segment. For example, /api/v1/users/:id has path param "id". A path like /api/v1/users has NO path params. NEVER invent path parameters for parameterless routes.
12. If an endpoint returns res.status(204).send() or res.sendStatus(204) or sends no body at all, do NOT create an empty JSON code block. Instead, write exactly: **Response:** No Content (Status 204).`;

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
