import { MetadataRoute } from 'next';

const BASE_URL = 'https://qmenu.digital';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/ejemplo', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/guias', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/guias/como-crear-un-menu-digital', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/guias/caracteristicas-menu-digital', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/guias/cuanto-sale-crear-un-menu-digital', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/guias/como-crear-platos-para-menu-digital', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/guias/como-personalizar-tu-menu-digital', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/guias/como-crear-promociones-en-tu-restaurante', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/cotizar-menu', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contacto', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/politicas', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terminos-y-condiciones', changeFrequency: 'yearly', priority: 0.3 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
