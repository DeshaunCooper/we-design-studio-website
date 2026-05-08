// functions/api/inquiry.js
// Cloudflare Pages Function — handles all inquiry types via Resend email API.
// Required env var (set in Cloudflare Pages → Settings → Environment Variables):
//   RESEND_API_KEY   <your key from resend.com>

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function buildClientEmail(f) {
  return {
    subject: `New We Design Client Inquiry — ${f.service || 'General'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">New Client Inquiry</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via wedesignsstudio.com</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${f.name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Business</td><td>${f.business_name || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${f.email}">${f.email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${f.phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Service</td><td><strong>${f.service || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Payment Pref.</td><td>${f.payment_preference || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Budget</td><td>${f.budget || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Timeline</td><td>${f.timeline || '—'}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:14px;color:#374151;white-space:pre-wrap">${f.message || '—'}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

function buildEnterpriseEmail(f) {
  return {
    subject: `New We Design Enterprise Quote Request — ${f.business_name || f.name || 'Unknown'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">Enterprise Quote Request</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via Enterprise Gateway</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${f.name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Business</td><td>${f.business_name || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${f.email}">${f.email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${f.phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Budget</td><td>${f.budget || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Timeline</td><td>${f.timeline || '—'}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <h4 style="margin-bottom:8px">What they need built</h4>
  <p style="font-size:14px;white-space:pre-wrap">${f.project_scope || '—'}</p>
  ${f.message ? `<h4>Additional notes</h4><p style="font-size:14px;white-space:pre-wrap">${f.message}</p>` : ''}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

function buildDesignerEmail(f) {
  return {
    subject: `New We Design Designer Application — ${f.name || 'Unknown'}`,
    html: `
<div style="font-family:sans-serif;max-width:600px;color:#111">
  <h2 style="margin-bottom:4px">Designer Application</h2>
  <p style="color:#6b7280;font-size:13px;margin-top:0">Submitted via careers page</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td><strong>${f.name || '—'}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Email</td><td><a href="mailto:${f.email}">${f.email || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td>${f.phone || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Portfolio</td><td><a href="${f.portfolio}">${f.portfolio || '—'}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Skill Level</td><td>${f.skill_level || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Services</td><td>${f.services || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Availability</td><td>${f.availability || '—'}</td></tr>
  </table>
  ${f.message ? `<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/><p style="font-size:14px;white-space:pre-wrap">${f.message}</p>` : ''}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#9ca3af">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
</div>`,
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  // Honeypot spam check
  if (body.botcheck || body._honey) return json({ success: true });

  if (!body.email || !body.email.includes('@')) {
    return json({ error: 'Valid email is required.' }, 400);
  }
  const type = body.inquiry_type || 'client';
  if (type !== 'designer' && !body.name) {
    return json({ error: 'Name is required.' }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[inquiry] RESEND_API_KEY not set.');
    return json({ success: true, warning: 'Email not sent — RESEND_API_KEY missing.' });
  }

  let emailContent;
  if (type === 'enterprise') emailContent = buildEnterpriseEmail(body);
  else if (type === 'designer') emailContent = buildDesignerEmail(body);
  else emailContent = buildClientEmail(body);

  const fromEmail = env.RESEND_FROM_EMAIL || 'We Design Studio <onboarding@resend.dev>';
  const toEmail = env.CONTACT_TO_EMAIL || 'hello@wedesignsstudio.com';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: body.email,
      subject: emailContent.subject,
      html: emailContent.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[inquiry] Resend error:', err);
    return json({ error: 'Failed to send. Please email hello@wedesignsstudio.com directly.' }, 500);
  }

  return json({ success: true });
}
