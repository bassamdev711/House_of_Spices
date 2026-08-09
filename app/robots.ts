import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/admin/*', 
        '/api/', 
        '/cart', 
        '/checkout', 
        '/account', 
        '/orders',
        '/_next/',
        '/api/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
