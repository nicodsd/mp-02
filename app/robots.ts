import { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/panel-de-usuario/',
        '/api/',
        '/mi-menu/',
        '/admin/',
        '/nuevo-plato',
        '/pagos',
        '/olvide-mi-contrasena',
        '/restablecer-contrasena',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
