function extractExpressRoutes(code) {
  const METHOD_VERBS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
  const routes = [];

  for (const method of METHOD_VERBS) {
    const regex = new RegExp(
      `\\b${method}\\s*\\(\\s*['\"\`(][^'\"\`]*['\"\`\\)]`,
      'gi'
    );

    let match;
    while ((match = regex.exec(code)) !== null) {
      const fullMatch = match[0];
      const pathMatch = fullMatch.match(/['"\`]([^'"\`]+)['"\`]/);
      if (!pathMatch) continue;

      const path = pathMatch[1];
      if (!path.startsWith('/')) continue;

      routes.push({
        method: method.toUpperCase(),
        path,
        handler: '(inline)',
      });
    }
  }

  return routes;
}

function extractFlaskRoutes(code) {
  const routes = [];

  const routeRegex = /@(?:app|blueprint)\.route\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*methods\s*=\s*\[([^\]]+)\])?\s*\)/gi;
  let match;

  while ((match = routeRegex.exec(code)) !== null) {
    const path = match[1];
    const methodsStr = match[2] || "'GET'";

    const methods = methodsStr.match(/['"](\w+)['"]/g)?.map(m => m.replace(/['"]/g, '').toUpperCase()) || ['GET'];

    for (const method of methods) {
      routes.push({
        method,
        path,
        handler: '(decorated function)',
      });
    }
  }

  return routes;
}

function extractFastAPIRoutes(code) {
  const routes = [];

  const methodRegex = /@(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: match[2],
      handler: '(decorated function)',
    });
  }

  return routes;
}

function extractDjangoRoutes(code) {
  const routes = [];

  const pathRegex = /path\s*\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)/g;
  let match;

  while ((match = pathRegex.exec(code)) !== null) {
    routes.push({
      method: 'GET/POST',
      path: '/' + match[1].replace(/^\^/, '').replace(/\$$/, ''),
      handler: match[2],
    });
  }

  return routes;
}

function extractRailsRoutes(code) {
  const routes = [];

  const methodRegex = /\b(get|post|put|patch|delete)\s+['"]([^'"]+)['"](?:\s+to:\s*['"]([^'"]+)['"])?/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: '/' + match[2],
      handler: match[3] || '(block)',
    });
  }

  return routes;
}

function extractGoRoutes(code) {
  const routes = [];

  const methodRegex = /\.(GET|POST|PUT|PATCH|DELETE)\s*\(\s*['"]([^'"]+)['"]/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: match[2],
      handler: '(handler func)',
    });
  }

  return routes;
}

function extractSpringRoutes(code) {
  const routes = [];

  const classMatch = code.match(/@RequestMapping\s*\(\s*['"]([^'"]+)['"]\s*\)/);
  const basePath = classMatch ? classMatch[1] : '';

  const methodRegex = /@(Get|Post|Put|Delete|Patch)Mapping\s*\(\s*(?:value\s*=\s*)?['"]?([^'")\s]+)['"]?\s*\)/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    const method = match[1].toUpperCase();
    const path = match[2];
    const fullPath = basePath + (path.startsWith('/') ? path : '/' + path);

    routes.push({
      method,
      path: fullPath,
      handler: '(controller method)',
    });
  }

  return routes;
}

function extractLaravelRoutes(code) {
  const routes = [];

  const methodRegex = /Route::(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: '/' + match[2].replace(/^\//, ''),
      handler: '(closure/route)',
    });
  }

  return routes;
}

function extractASPNetRoutes(code) {
  const routes = [];

  const methodRegex = /\[(HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch)(?:\s*\(\s*['"]([^'"]+)['"]\s*\))?\]/gi;
  let match;

  while ((match = methodRegex.exec(code)) !== null) {
    const method = match[1].replace('Http', '').toUpperCase();
    const path = match[2] || '/';

    routes.push({
      method,
      path,
      handler: '(action method)',
    });
  }

  return routes;
}

const EXTRACTORS = {
  express: extractExpressRoutes,
  flask: extractFlaskRoutes,
  fastapi: extractFastAPIRoutes,
  django: extractDjangoRoutes,
  rails: extractRailsRoutes,
  gin: extractGoRoutes,
  echo: extractGoRoutes,
  nethttp: extractGoRoutes,
  spring: extractSpringRoutes,
  laravel: extractLaravelRoutes,
  aspnet: extractASPNetRoutes,
};

function extractRoutes(code, language) {
  if (!code || typeof code !== 'string') return [];

  const extractor = EXTRACTORS[language];
  if (!extractor) return [];

  const routes = extractor(code);

  const seen = new Set();
  return routes.filter(r => {
    const key = `${r.method}:${r.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { extractRoutes };
