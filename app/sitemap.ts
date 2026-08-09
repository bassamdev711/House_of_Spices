import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma'; // Assuming this is where prisma client is

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 1. Get all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 2. Get all active collections/categories
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const collectionUrls = collections.map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // 3. Get all active legal pages (or generic pages)
    const pages = await prisma.legalPage.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const pageUrls = pages.map((page) => ({
      url: `${baseUrl}/pages/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    // 4. Static routes
    const routes = ['', '/products', '/collections', '/contact'].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    return [...routes, ...collectionUrls, ...productUrls, ...pageUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to basic sitemap if DB fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      }
    ];
  }
}
