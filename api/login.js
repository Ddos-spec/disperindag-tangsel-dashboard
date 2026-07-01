const { verifyAccessCode, createSessionToken, sessionCookie, readJson, json, isLoginRateLimited } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
  if (isLoginRateLimited(req)) return json(res, 429, { ok: false, error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' });
  try {
    const body = await readJson(req);
    const accessCode = String(body.accessCode || '');
    if (!verifyAccessCode(accessCode)) return json(res, 401, { ok: false, error: 'Access code salah.' });
    res.setHeader('Set-Cookie', sessionCookie(createSessionToken()));
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 400, { ok: false, error: error.message || 'Bad request' });
  }
};
