const METHOD_VERBS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

function extractRoutes(code) {
  if (!code || typeof code !== 'string') return [];

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

      let handler = '';
      const afterRoute = code.slice(match.index + fullMatch.length);
      const handlerMatch = afterRoute.match(
        /(?:,\s*|,\s*(?:\w+\s*=>\s*|function\s*\([^)]*\)\s*\{?|async\s+function\s*\([^)]*\)\s*\{?|async\s+\w+\s*=>\s*))/i
      );
      if (handlerMatch) {
        const remaining = afterRoute.slice(handlerMatch[0].length);
        if (remaining.startsWith('async')) handler = 'async';
        else if (remaining.match(/^\w+\s*\(/)) handler = remaining.match(/^(\w+)/)?.[1] || '';
      }

      const existing = routes.find(r => r.path === path && r.method === method.toUpperCase());
      if (!existing) {
        routes.push({
          method: method.toUpperCase(),
          path,
          handler: handler || '(inline)',
        });
      }
    }
  }

  return routes;
}

module.exports = { extractRoutes };
