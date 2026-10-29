// PBKDF2-SHA256 password/OTP hashing (bcrypt is unavailable in Workers;
// PBKDF2 with 100k iterations via WebCrypto is the Workers-native equivalent).
const ITERATIONS = 100000;

function toB64(buf) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export async function hashSecret(secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return `pbkdf2$${toB64(salt)}$${toB64(bits)}`;
}

export async function verifySecret(secret, stored) {
  if (!stored || !stored.startsWith('pbkdf2$')) return false;
  const [, saltB64, hashB64] = stored.split('$');
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  const expected = Uint8Array.from(atob(hashB64), (c) => c.charCodeAt(0));
  const got = new Uint8Array(bits);
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ expected[i];
  return diff === 0;
}
