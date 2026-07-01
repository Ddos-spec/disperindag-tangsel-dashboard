const { clearSessionCookie, json } = require('../lib/auth');

module.exports = function handler(req, res) {
  res.setHeader('Set-Cookie', clearSessionCookie());
  return json(res, 200, { ok: true });
};
