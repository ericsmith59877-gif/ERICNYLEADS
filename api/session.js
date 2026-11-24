// GET = am I logged in? POST = log in. DELETE = log out.
const A = require('./_auth.js'); const fails = {};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'POST') {
    const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0], f = fails[ip] || { n: 0, t: Date.now() };
    if (Date.now() - f.t > 9e5) { f.n = 0; f.t = Date.now(); }
    if (f.n >= 8) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } } b = b || {};
    if (A.check(b.username, b.password)) { delete fails[ip]; res.setHeader('Set-Cookie', A.cookie(A.make())); return res.status(200).json({ authed: true }); }
    f.n++; fails[ip] = f; await new Promise(r => setTimeout(r, 700));
    return res.status(401).json({ error: 'Wrong username or password' });
  }
  if (req.method === 'DELETE') { res.setHeader('Set-Cookie', A.cookie('', 0)); return res.status(200).json({ authed: false }); }
  res.status(200).json({ authed: A.ok(req) });
};
