const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `You are a technical documentation generator. You will receive Express.js route code.
Generate clean Markdown documentation with:

# API Documentation

## Endpoints
| Method | Path | Description |
|--------|------|-------------|

Then for each route:
### \`METHOD /path\`
**Description:** ...
**Parameters:** ...
**Example Response:** (JSON block)

Rules:
- Use strict Markdown tables
- Generate meaningful descriptions from route paths
- Be concise but informative
- Always include the method in uppercase`;

async function documentCode(code) {
  const routes = extractRoutes(code);

  if (routes.length === 0) {
    console.log('No Express routes found.');
    return;
  }

  console.log(`Found ${routes.length} routes:\n`);
  routes.forEach(r => console.log(`  ${r.method} ${r.path}`));
  console.log('\nGenerating documentation...\n');

  const routeSummary = routes.map(r => `${r.method} ${r.path}`).join('\n');

  const result = await hf.chatCompletion({
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Routes:\n${routeSummary}` },
    ],
    max_tokens: 2048,
    temperature: 0.3,
  });

  console.log(result.choices[0].message.content);
}

function extractRoutes(code) {
  const METHOD_VERBS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
  const routes = [];

  for (const method of METHOD_VERBS) {
    const regex = new RegExp(`\\b${method}\\s*\\(\\s*['"\`(][^'"\`]*['"\`\\)]`, 'gi');
    let match;
    while ((match = regex.exec(code)) !== null) {
      const pathMatch = match[0].match(/['"\`]([^'"\`]+)['"\`]/);
      if (pathMatch && pathMatch[1].startsWith('/')) {
        const existing = routes.find(r => r.path === pathMatch[1] && r.method === method.toUpperCase());
        if (!existing) {
          routes.push({ method: method.toUpperCase(), path: pathMatch[1] });
        }
      }
    }
  }
  return routes;
}

const sampleCode = `
const router = require('express').Router();

router.get('/api/v1/users', async (req, res) => {
  const users = await User.findAll();
  res.json({ success: true, data: users });
});

router.post('/api/v1/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

router.get('/api/v1/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json({ success: true, data: posts });
});

module.exports = router;
`;

documentCode(sampleCode);
