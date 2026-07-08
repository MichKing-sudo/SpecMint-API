const BASE_PROMPT = `You are a technical documentation generator. You will receive source code from a {FRAMEWORK} backend.

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
- List ALL parameters found in the code (path params, query params, body fields)

**Example Response:**
\`\`\`json
(real JSON from the response in the code)
\`\`\`

**Error Response:**
\`\`\`json
(real JSON from error cases in the code)
\`\`\`

---

## STRICT RULES

1. Generate the table using EXACTLY this pipe format: | Method | Path | Description | with separator |---|---|---|. Each row MUST start on a new line. NEVER collapse the table into a single line.
2. You MUST read the FULL source code block. Extract EVERY parameter.
3. You MUST replicate EXACTLY the real JSON objects found in response calls.
4. If the code has a success response, your example MUST show exactly that.
5. If the code has an error response, your error response MUST show exactly that.
6. If a route has no error handling in the code, omit the Error Response section.
7. Always include the method in uppercase in the table.
8. Generate meaningful descriptions from the route paths and code logic.
9. Group routes logically by their base path.
10. Path parameters MUST ONLY be listed for routes whose path contains parameters.
11. If an endpoint returns no body, do NOT create an empty JSON code block. Instead, write exactly: **Response:** No Content (Status 204).

## [REGLAS ESTRICTAS DE RESPUESTA JSON]
1. SIEMPRE abre los bloques de código de respuesta usando \`\`\`json. Está prohibido dejar el bloque sin etiqueta o genérico. NUNCA uses \`\`\` sin "json" después.
2. Formatea CUALQUIER booleano dentro de los bloques de ejemplo al estándar JSON estricto: escribe "true" y "false" en minúsculas, NUNCA "True" o "False", incluso si el código fuente es Python o usa otros valores. Esto aplica a TODAS las respuestas de ejemplo y respuestas de error.
3. Formatea "null" en minúsculas, NUNCA "None" o "Null".`;

const LANGUAGE_SPECIFIC_NOTES = {
  express: `

## Express.js Specific Notes
- Look for req.params, req.query, and req.body for parameters
- Look for res.json(), res.status().json(), res.send() for responses
- Look for res.status(204).send() or res.sendStatus(204) for no-content responses`,

  flask: `

## Flask Specific Notes
- Look for request.args for query parameters
- Look for request.json or request.get_json() for body
- Look for request.view_args for path parameters
- Look for jsonify() or return dicts for responses
- Look for @app.route(methods=[...]) for multiple methods`,

  fastapi: `

## FastAPI Specific Notes
- Look for Path parameters as function arguments
- Look for Query parameters as function arguments with default values
- Look for Pydantic models (BaseModel) for request body
- Look for response_model for typed responses
- Look for status_code in decorator`,

  django: `

## Django Specific Notes
- Look for path converters like <int:pk> for parameters
- Look for request.GET, request.POST for data
- Look for JsonResponse for responses
- Look for @require_http_methods decorators`,

  rails: `

## Ruby on Rails Specific Notes
- Look for params[:id], params[:name] for parameters
- Look for render json: for responses
- Look for head :no_content for no-content responses
- Look for resources and resource routes`,

  gin: `

## Go (Gin) Specific Notes
- Look for c.Param(), c.Query(), c.ShouldBindJSON() for parameters
- Look for c.JSON() for responses
- Look for c.AbortWithStatusJSON() for error responses`,

  echo: `

## Go (Echo) Specific Notes
- Look for c.Param(), c.QueryParam() for parameters
- Look for c.JSON() for responses
- Look for c.JSONPretty() for formatted responses`,

  nethttp: `

## Go (net/http) Specific Notes
- Look for r.URL.Query() for query parameters
- Look for mux.Vars(r) for path parameters
- Look for json.NewEncoder(w).Encode() for responses`,

  spring: `

## Java (Spring Boot) Specific Notes
- Look for @PathVariable for path parameters
- Look for @RequestParam for query parameters
- Look for @RequestBody for request body
- Look for ResponseEntity for responses
- Look for @ResponseStatus for status codes`,

  laravel: `

## PHP (Laravel) Specific Notes
- Look for Route parameters like {id}
- Look for $request->input() or $request->all() for body
- Look for response()->json() for responses
- Look for Route::resource for resource routes`,

  aspnet: `

## C# (ASP.NET) Specific Notes
- Look for [FromRoute] for path parameters
- Look for [FromQuery] for query parameters
- Look for [FromBody] for request body
- Look for IActionResult or ActionResult for responses
- Look for StatusCode() or Ok() for status codes`,
};

function getPrompt(language, frameworkName) {
  let prompt = BASE_PROMPT.replace('{FRAMEWORK}', frameworkName);

  const specificNotes = LANGUAGE_SPECIFIC_NOTES[language];
  if (specificNotes) {
    prompt += specificNotes;
  }

  return prompt;
}

module.exports = { getPrompt };
