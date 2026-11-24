import { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo/site';

const routes: Array<{
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '', lastModified: '2026-03-01', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/ejemplo', lastModified: '2026-03-01', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/guias', lastModified: '2026-03-01', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/guias/como-crear-un-menu-digital', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/guias/caracteristicas-menu-digital', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/guias/cuanto-sale-crear-un-menu-digital', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/guias/como-crear-platos-para-menu-digital', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/guias/como-personalizar-tu-menu-digital', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/guias/como-crear-promociones-en-tu-restaurante', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/cotizar-menu', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contacto', lastModified: '2026-03-01', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/politicas', lastModified: '2026-02-01', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terminos-y-condiciones', lastModified: '2026-02-01', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
