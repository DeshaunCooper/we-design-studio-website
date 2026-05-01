// api/checkout.js
// Creates a Stripe Checkout session for fixed-fee packages.
// Enterprise goes through the inquiry form, not here.
//
// Required env vars (set in Vercel → Project Settings → Environment Variables):
//   STRIPE_SECRET_KEY     sk_live_xxx  (or sk_test_xxx for testing)
//   SITE_URL              https://we-design-studio-website.vercel.app
//
// Optional — pre-created Stripe Price IDs (if blank, price_data is used instead):
//   STRIPE_PRICE_LANDING_PAGE   price_xxx
//   STRIPE_PRICE_FULL_WEBSITE   price_xxx
//   STRIPE_PRICE_SWIFT_MVP      price_xxx

const PACKAGES = {
  landingPage: {
    name: 'Landing Page — We Design Studio',
    description: 'One-page professional website. Mobile responsive, brand styling, contact section, and call-to-action.',
    amount: 75000, // $750.00 in cents
    priceEnvKey: 'STRIPE_PRICE_LANDING_PAGE',
  },
  fullWebsite: {
    name: 'Full Website — We Design Studio',
    description: 'Multi-section business website with Home / About / Services / Contact, mobile design, and SEO structure.',
    amount: 140000, // $1,400.00
    priceEnvKey: 'STRIPE_PRICE_FULL_WEBSITE',
  },
  swiftMVP: {
    name: 'Swift MVP App — We Design Studio',
    description: 'iOS MVP app built with Swift/SwiftUI. Core screens, navigation, starter UI. Prototype-ready structure.',
    amount: 250000, // $2,500.00
    priceEnvKey: 'STRIPE_PRICE_SWIFT_MVP',
  },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY in Vercel env vars.' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const pkg = PACKAGES[body.package];

  if (!pkg) {
    return res.status(400).json({ error: `Unknown package: ${body.package}. Valid options: ${Object.keys(PACKAGES).join(', ')}` });
  }

  const siteUrl = process.env.SITE_URL || 'https://we-design-studio-website.vercel.app';

  // Use pre-created Stripe Price ID if configured; otherwise generate via price_data
  const lineItem = process.env[pkg.priceEnvKey]
    ? { price: process.env[pkg.priceEnvKey], quantity: 1 }
    : {
        price_data: {
          currency: 'usd',
          product_data: { name: pkg.name, description: pkg.description },
          unit_amount: pkg.amount,
        },
        quantity: 1,
      };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}&pkg=${body.package}`,
      cancel_url: `${siteUrl}/cancel.html`,
      metadata: { package: body.package },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[api/checkout] Stripe error:', err.message);
    return res.status(500).json({ error: 'Checkout session failed. Please try again or contact hello@wedesignsstudio.com' });
  }
};
