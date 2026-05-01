// api/inquiry.js
// Handles all public inquiry types: client contact, enterprise quotes, designer applications.
// Sends email via Gmail SMTP using Nodemailer.
//
// Required env vars (set in Vercel → Project Settings → Environment Variables):
//   SMTP_HOST          smtp.gmail.com
//   SMTP_PORT          465
//   SMTP_SECURE        true
//   SMTP_USER          hello@wedesignsstudio.com
//   SMTP_PASS          <Google App Password — from myaccount.google.com/apppasswords>
//   CONTACT_TO_EMAIL   hello@wedesignsstudio.com

const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildClientEmail(fields) {
  const {
    name, business_name, email, phone,
    service, payment_preference, budget, timeline, message,
  } = fields;
  return {
    subject: `New We Design Client Inquiry — ${service || 'General'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">New Client Inquiry</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via we-design-studio-website.vercel.app</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Business</td><td>${business_name || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${email}">${email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Service</td><td><strong>${service || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Payment Pref.</td><td>${payment_preference || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Budget</td><td>${budget || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Timeline</td><td>${timeline || '—'}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:14px;color:#374151;white-space:pre-wrap">${message || '—'}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

function buildEnterpriseEmail(fields) {
  const { name, business_name, email, phone, project_scope, budget, timeline, message } = fields;
  return {
    subject: `New We Design Enterprise Quote Request — ${business_name || name || 'Unknown'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">Enterprise Quote Request</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via Enterprise Gateway</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Business</td><td>${business_name || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${email}">${email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Budget</td><td>${budget || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Timeline</td><td>${timeline || '—'}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <h4 style="margin-bottom:8px">What they need built</h4>
  <p style="font-size:14px;white-space:pre-wrap">${project_scope || '—'}</p>
  ${message ? `<h4>Additional notes</h4><p style="font-size:14px;white-space:pre-wrap">${message}</p>` : ''}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

function buildDesignerEmail(fields) {
  const { name, email, phone, portfolio, skill_level, services, availability, message } = fields;
  return {
    subject: `New We Design Designer Inquiry — ${name || 'Unknown'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">Designer Application</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via careers.html</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${email}">${email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Portfolio</td><td><a href="${portfolio}">${portfolio || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Skill Level</td><td>${skill_level || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Services</td><td>${services || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Availability</td><td>${availability || '—'}</td></tr>
  </table>
  ${message ? `<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/><p style="font-size:14px;white-space:pre-wrap">${message}</p>` : ''}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  // Honeypot spam check
  if (body.botcheck || body._honey) return res.status(200).json({ success: true });

  const type = body.inquiry_type || 'client';
  const toEmail = process.env.CONTACT_TO_EMAIL || 'hello@wedesignsstudio.com';
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@wedesignsstudio.com';

  // Require email in all cases
  if (!body.email || !body.email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  // Require name for client and enterprise
  if (type !== 'designer' && !body.name) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  let emailContent;
  if (type === 'enterprise') {
    emailContent = buildEnterpriseEmail(body);
  } else if (type === 'designer') {
    emailContent = buildDesignerEmail(body);
  } else {
    emailContent = buildClientEmail(body);
  }

  // Return safe response if SMTP not configured (lets frontend show success without crashing)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[api/inquiry] SMTP not configured. Set SMTP_USER and SMTP_PASS env vars.');
    return res.status(200).json({
      success: true,
      warning: 'SMTP not configured — email not sent. Set SMTP_USER and SMTP_PASS in Vercel.',
    });
  }

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from: `"We Design Studio" <${fromEmail}>`,
      to: toEmail,
      replyTo: body.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[api/inquiry] Send error:', err.message);
    return res.status(500).json({ error: 'Failed to send email. Please try again or contact hello@wedesignsstudio.com' });
  }
};
