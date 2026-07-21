/** @type {import('next').NextConfig} */

// Canonical host: everything must resolve to https://mavlers.ai (apex, https,
// no www) in a single redirect hop — never a chain or loop.
const CANONICAL_HOST = 'mavlers.ai';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Allow Supabase Storage public URLs. Host is derived at runtime; we allow https broadly for CMS-managed images.
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      // www.mavlers.ai (any protocol) → https://mavlers.ai  (single hop)
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // http://mavlers.ai → https://mavlers.ai  (defensive; Vercel also upgrades
      // http→https at the edge, and HSTS makes repeat visits skip this entirely)
      {
        source: '/:path*',
        has: [
          { type: 'host', value: CANONICAL_HOST },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Tell browsers to always use https for this host, so http requests
          // are upgraded client-side without an extra network redirect.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
