from django.http import HttpResponse


def root(request):
	"""Landing page for the API server root — Django serves JSON/REST only; the UI runs on Next.js."""
	html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hireonix API</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.5; color: #1a1a1a; }
    h1 { font-size: 1.25rem; }
    a { color: #2563eb; }
    ul { padding-left: 1.25rem; }
    code { background: #f4f4f5; padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Hireonix API is running</h1>
  <p>This server exposes REST endpoints for the app. The <strong>web UI</strong> is the Next.js app (usually <code>http://localhost:3000</code>).</p>
  <ul>
    <li><a href="/api/v1/docs">OpenAPI docs (Swagger)</a></li>
    <li><a href="/api/v1/health">Health check</a></li>
    <li><a href="/admin/">Django admin</a></li>
  </ul>
</body>
</html>"""
	return HttpResponse(html)
