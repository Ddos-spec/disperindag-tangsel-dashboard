const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('../lib/auth');

module.exports = function handler(req, res) {
  if (!isAuthenticated(req)) {
    res.statusCode = 302;
    res.setHeader('Location', '/login.html?next=/');
    res.end('Redirecting');
    return;
  }
  const file = path.join(process.cwd(), 'api', '_templates', 'dashboard.html');
  const html = fs.readFileSync(file, 'utf8');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(html);
};
