const { isAuthenticated, json } = require('../lib/auth');

module.exports = function handler(req, res) {
  return json(res, 200, { authenticated: isAuthenticated(req) });
};
