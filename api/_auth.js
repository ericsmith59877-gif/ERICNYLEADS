// Shared login helpers. Credentials default to eric / eric911; override in Vercel with env vars APP_USER and APP_PASS.
const crypto = require('crypto');
const USER = process.env.APP_USER || 'eric', PASS = process.env.APP_PASS || 'eric911';
const SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update('xm|' + USER + '|' + PASS).digest('hex');
const sign = v => crypto.createHmac('sha256', SECRET).update(v).digest('base64url');
const h = s => crypto.createHash('sha256').update(String(s ?? '')).digest();
exports.check = (u, p) => { const a = crypto.timingSafeEqual(h(u), h(USER)), b = crypto.timingSafeEqual(h(p), h(PASS)); return a && b; };
exports.make = () => { const p = USER + '.' + (Date.now() + 7 * 864e5); return p + '.' + sign(p); };
exports.cookie = (v, age = 604800) => `xm_session=${encodeURIComponent(v)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
exports.ok = req => {
  const c = String(req.headers.cookie || '').split(/;\s*/).find(x => x.startsWith('xm_session='));
  if (!c) return false;
  const v = decodeURIComponent(c.slice(11)), i = v.lastIndexOf('.'); if (i < 0) return false;
  const p = v.slice(0, i), sg = Buffer.from(v.slice(i + 1)), ex = Buffer.from(sign(p));
  const [u, exp] = p.split('.');
  return sg.length === ex.length && crypto.timingSafeEqual(sg, ex) && u === USER && Date.now() < +exp;
};
