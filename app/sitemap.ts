import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://qmenu.digital',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Si en el futuro agregas páginas como /precios o /guias, las sumas acá
    {
      url: 'https://qmenu.digital/contacto',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];
}
