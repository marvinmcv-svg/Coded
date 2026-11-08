/**
 * Response headers for every route. The CSP lists only the third parties the site actually uses:
 * GA4 (loaded after consent, Q26) and the HubSpot meetings iframe on /consultation (Q24). HubSpot Forms is
 * called server-side, so it needs no browser allowance. Add an origin here when a new embed lands (e.g. WhatsApp, Q23).
 * 'unsafe-inline' scripts: Next's static pages inline their bootstrap and JSON-LD; nonces would force dynamic rendering.
 */
const dev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "media-src 'self'",
  "frame-src https://meetings.hubspot.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // No includeSubDomains/preload until the domain (Q0) and its subdomains (app., store.) are known to be HTTPS-only.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];
