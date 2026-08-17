import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

if (!baseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_SITE_URL must be configured in production')
}

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
    sitemap: `${baseUrl || 'http://localhost:3000'}/sitemap.xml`,
  };
}
