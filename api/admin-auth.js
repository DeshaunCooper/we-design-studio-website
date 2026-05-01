// api/admin-auth.js
// Server-side admin credential validation.
// Credentials are never exposed in frontend source code.
//
// Required env vars (set in Vercel → Project Settings → Environment Variables):
//   ADMIN_EMAIL      hello@wedesignsstudio.com
//   ADMIN_PASSWORD   <your chosen admin password>
//   ADMIN_SECRET     <random string, used to sign session tokens — e.g. openssl rand -hex 32>

const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'hello@wedesignsstudio.com';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('[api/admin-auth] ADMIN_PASSWORD not set in env vars.');
    return res.status(503).json({ error: 'Admin auth not configured. Set ADMIN_PASSWORD in Vercel env vars.' });
  }

  // Constant-time comparison to prevent timing attacks
  const emailMatch = crypto.timingSafeEqual(
    Buffer.from(email.toLowerCase().trim()),
    Buffer.from(adminEmail.toLowerCase().trim())
  );
  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(adminPassword)
  );

  if (!emailMatch || !passMatch) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  // Generate a signed session token valid for 8 hours
  const secret = process.env.ADMIN_SECRET || adminPassword;
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const payload = `${adminEmail}:${expires}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(JSON.stringify({ payload, sig })).toString('base64');

  return res.status(200).json({ success: true, token, expires });
};
