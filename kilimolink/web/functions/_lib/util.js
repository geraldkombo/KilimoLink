export function uuid() {
  return crypto.randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function err(status, message) {
  const errorText = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
  }[status] || 'Error';
  return json({ statusCode: status, message, error: errorText }, status);
}

export function withCors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  res.headers.set('Access-Control-Max-Age', '86400');
  return res;
}

export function parseLocation(row) {
  if (!row) return row;
  const out = { ...row };
  if (typeof out.location === 'string') {
    try { out.location = JSON.parse(out.location); } catch { out.location = null; }
  }
  return out;
}

export function stripUser(u) {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
}
