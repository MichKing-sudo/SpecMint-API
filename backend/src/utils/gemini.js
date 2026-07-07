const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
- Generate the table using EXACTLY this pipe format: | Method | Path | Description | with separator |---|---|---|. Each row MUST start on a new line.
- Path parameters (req.params) MUST ONLY be listed for routes whose path contains a colon (:) segment. For example, /api/v1/users/:id has path param "id". A path like /api/v1/users has NO path params. NEVER invent path parameters for parameterless routes.
- If an endpoint returns res.status(204).send() or res.sendStatus(204) or sends no body at all, do NOT create an empty JSON code block. Instead, write exactly: **Response:** No Content (Status 204).
- Generate meaningful descriptions based on the route paths
- Be concise but informative
- Always include the method in uppercase
- Group routes logically by their base path`;

async function generateDocumentation(routes) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const routeSummary = routes
    .map(r => `${r.method} ${r.path}`)
    .join('\n');

  const prompt = `${SYSTEM_PROMPT}\n\nHere are the extracted routes:\n${routeSummary}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { generateDocumentation };
