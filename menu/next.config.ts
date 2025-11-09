import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //Configuracion de usecache
  experimental: {
    useCache: true,
  },

  // 🔧 Desactiva Turbopack
  turbopack: {
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  // 🌐 Configuración personalizada que ya tenías
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.*.*',
  ],
  crossOrigin: 'anonymous',
  onDemandEntries: {
    maxInactiveAge: 2 * 1000,
    pagesBufferLength: 2,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https:;
              frame-src https://js.stripe.com;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;