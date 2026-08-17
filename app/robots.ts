import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://house-of-spices-linl.vercel.app'

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
        '/search',
        '/favorites',
        '/login',
        '/api/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
