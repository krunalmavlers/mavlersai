/** @type {import('next').NextConfig} */
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
      {
        // /services is retired: the three service pages are the destinations
        // now. A 301 rather than a 404 because the URL is in the sitemap, is
        // likely indexed, and may be bookmarked.
        source: '/services',
        destination: '/services/ai-development',
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;
