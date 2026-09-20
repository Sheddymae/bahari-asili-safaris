export async function activitySignature(timestamp: number, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(timestamp)));
  return Array.from(new Uint8Array(signature)).map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function buildActivityCookie(secret: string, timestamp = Date.now()) {
  return `${timestamp}.${await activitySignature(timestamp, secret)}`;
}

export async function verifyActivityValue(value: string | null | undefined, secret: string) {
  if (!value || !secret) return null;
  const [raw, signature] = value.split('.');
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp) || timestamp > Date.now() + 5000 || !signature) return null;
  const expected = await activitySignature(timestamp, secret);
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  return mismatch === 0 ? timestamp : null;
}
