const crypto = require('crypto');

const COOKIE_NAME = 'disperindag_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;

function env(name) {
  return process.env[name] || '';
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''), 'hex');
  const right = Buffer.from(String(b || ''), 'hex');
  if (left.length !== right.length || left.length === 0) return false;
  return crypto.timingSafeEqual(left, right);
}

function verifyAccessCode(code) {
  const salt = env('DASHBOARD_ACCESS_SALT');
  const hash = env('DASHBOARD_ACCESS_HASH');
  if (!salt || !hash || !code) return false;
  return safeEqual(sha256Hex(`${salt}:${code}`), hash);
}

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function b64urlJson(obj) {
  return b64url(JSON.stringify(obj));
}

function sign(payload) {
  const secret = env('SESSION_SECRET');
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = b64urlJson({ iat: now, exp: now + MAX_AGE_SECONDS, scope: 'dashboard' });
  return `${payload}.${sign(payload)}`;
}

function parseCookies(header = '') {
  return Object.fromEntries(String(header).split(';').map(part => {
    const index = part.indexOf('=');
    if (index < 0) return null;
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(Boolean));
}

function verifySessionToken(token) {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  let expected;
  try { expected = sign(payload); } catch { return false; }
  const left = Buffer.from(sig || '');
  const right = Buffer.from(expected || '');
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.scope === 'dashboard' && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return verifySessionToken(cookies[COOKIE_NAME]);
}

const LOGIN_ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_ATTEMPT_MAX = 8;
const loginAttempts = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function isLoginRateLimited(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const attempts = (loginAttempts.get(ip) || []).filter(ts => now - ts < LOGIN_ATTEMPT_WINDOW_MS);
  attempts.push(now);
  loginAttempts.set(ip, attempts);
  return attempts.length > LOGIN_ATTEMPT_MAX;
}

function sessionCookie(token) {
  const secure = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly${secure}; SameSite=Lax`;
}

function clearSessionCookie() {
  const secure = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly${secure}; SameSite=Lax`;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = {
  COOKIE_NAME,
  verifyAccessCode,
  createSessionToken,
  isAuthenticated,
  isLoginRateLimited,
  sessionCookie,
  clearSessionCookie,
  readJson,
  json
};
