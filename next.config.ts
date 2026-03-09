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
  ],
  crossOrigin: 'anonymous',

  onDemandEntries: {
    maxInactiveAge: 2 * 1000,
    pagesBufferLength: 2,
  },

  images: {
    remotePatterns: [
      new URL('https://floraprodutosnaturais.com.br/wp-content/uploads/2023/05/cheeseburguer-grelhado-com-tomate-cebola-e-fritas-gerado-por-ia-scaled.jpg'),
      new URL('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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