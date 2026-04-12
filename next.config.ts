import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },

  turbopack: {
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.*.*',
    '192.168.0.10',
    'qmenu.com.ar',
    '*.qmenu.com.ar',
    'michel-digit-marijuana-islamic.trycloudflare.com',
    '*.trycloudflare.com'
  ],
  crossOrigin: 'anonymous',

  onDemandEntries: {
    maxInactiveAge: 2 * 1000,
    pagesBufferLength: 2,
  },

  images: {
    remotePatterns: [
      new URL('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "floraprodutosnaturais.com.br",
        pathname: "/**",
      },
    ],
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
          }
        ],
      },
    ];
  },
};

export default nextConfig;