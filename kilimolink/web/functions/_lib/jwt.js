// HS256 JWT sign/verify with WebCrypto (same {sub, role, iat, exp} payload as the NestJS backend).
function b64url(bytes) {
  let s = '';
  const arr = bytes instanceof Uint8Array ? bytes : new TextEncoder().encode(bytes);
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(pad + '='.repeat((4 - (pad.length % 4)) % 4));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export function resolveSecret(env) {
  const s = env.JWT_SECRET;
  if (s && s !== 'change_me_in_production') return s;
  return 'dev-secret';
}

export async function signToken(payload, env, expiresInSeconds = 7 * 24 * 3600) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const iat = Math.floor(Date.now() / 1000);
  const body = b64url(JSON.stringify({ ...payload, iat, exp: iat + expiresInSeconds }));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(resolveSecret(env)), new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifyToken(token, env) {
  try {
    const [header, body, sig] = token.split('.');
    if (!header || !body || !sig) return null;
    const sigBytes = Uint8Array.from(b64urlDecode(sig), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(resolveSecret(env)), sigBytes, new TextEncoder().encode(`${header}.${body}`));
    if (!ok) return null;
    const payload = JSON.parse(b64urlDecode(body));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function authenticate(request, env) {
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  const payload = await verifyToken(token, env);
  if (!payload) return null;
  return { userId: payload.sub, role: payload.role || 'user' };
}
