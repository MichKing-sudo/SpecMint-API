const LANGUAGES = {
  express: {
    name: 'Express.js',
    patterns: [
      /require\s*\(\s*['"]express['"]\s*\)/,
      /import\s+.*from\s+['"]express['"]/,
      /app\.(get|post|put|patch|delete|use)\s*\(/,
      /router\.(get|post|put|patch|delete)\s*\(/,
    ],
  },
  flask: {
    name: 'Flask',
    patterns: [
      /from\s+flask\s+import/,
      /@app\.route\s*\(/,
      /@blueprint\.route\s*\(/,
    ],
  },
  fastapi: {
    name: 'FastAPI',
    patterns: [
      /from\s+fastapi\s+import/,
      /@app\.(get|post|put|patch|delete)\s*\(/,
      /APIRouter\s*\(/,
    ],
  },
  django: {
    name: 'Django',
    patterns: [
      /from\s+django\.conf\.urls\s+import/,
      /from\s+django\.urls\s+import\s+path/,
      /path\s*\(\s*['"]/,
      /url\s*\(\s*r?['"]/,
      /urlpatterns\s*=/,
    ],
  },
  rails: {
    name: 'Ruby on Rails',
    patterns: [
      /Rails\.application\.routes/,
      /get\s+['"]/,
      /post\s+['"]/,
      /put\s+['"]/,
      /patch\s+['"]/,
      /delete\s+['"]/,
      /resources?\s+:/,
    ],
  },
  gin: {
    name: 'Go (Gin)',
    patterns: [
      /gin\.Default\s*\(\)/,
      /gin\.New\s*\(\)/,
      /\.(GET|POST|PUT|PATCH|DELETE)\s*\(/,
      /r\.Group\s*\(/,
    ],
  },
  echo: {
    name: 'Go (Echo)',
    patterns: [
      /echo\.New\s*\(\)/,
      /\.(GET|POST|PUT|PATCH|DELETE)\s*\(/,
    ],
  },
  nethttp: {
    name: 'Go (net/http)',
    patterns: [
      /http\.Handle(Func)?\s*\(/,
      /mux\.Handle(Func)?\s*\(/,
      /http\.ListenAndServe\s*\(/,
    ],
  },
  spring: {
    name: 'Java (Spring Boot)',
    patterns: [
      /@RestController/,
      /@RequestMapping/,
      /@(Get|Post|Put|Delete|Patch)Mapping/,
      /@Controller/,
    ],
  },
  laravel: {
    name: 'PHP (Laravel)',
    patterns: [
      /Route::(get|post|put|patch|delete)\s*\(/,
      /use\s+Illuminate\\Support\\Facades\\Route/,
      /Route::resource\s*\(/,
      /Route::apiResource\s*\(/,
    ],
  },
  aspnet: {
    name: 'C# (ASP.NET)',
    patterns: [
      /\[HttpGet\s*\]/,
      /\[HttpPost\s*\]/,
      /\[HttpPut\s*\]/,
      /\[HttpDelete\s*\]/,
      /\[HttpPatch\s*\]/,
      /\[ApiController\]/,
      /MapControllers\s*\(/,
    ],
  },
};

function detectLanguage(code) {
  if (!code || typeof code !== 'string') return null;

  const scores = {};

  for (const [key, lang] of Object.entries(LANGUAGES)) {
    scores[key] = 0;
    for (const pattern of lang.patterns) {
      if (pattern.test(code)) {
        scores[key]++;
      }
    }
  }

  let best = null;
  let bestScore = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }

  return bestScore > 0 ? best : null;
}

function getLanguageName(key) {
  return LANGUAGES[key]?.name || key || 'Unknown';
}

function getSupportedLanguages() {
  return Object.entries(LANGUAGES).map(([key, lang]) => ({
    id: key,
    name: lang.name,
  }));
}

module.exports = { detectLanguage, getLanguageName, getSupportedLanguages };
