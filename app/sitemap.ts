import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://house-of-spices-linl.vercel.app'
  return new URL(configured).origin
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  try {
    const [products, collections, pages, campaigns] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.collection.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.legalPage.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.campaign.findMany({ where: { isActive: true, slug: { not: null } }, select: { slug: true, updatedAt: true } }),
    ])

    const routes = ['', '/products'].map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
    const collectionUrls = collections.map(collection => ({
      url: `${baseUrl}/products?collection=${encodeURIComponent(collection.slug)}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    const productUrls = products.map(product => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    const pageUrls = pages.map(page => ({
      url: `${baseUrl}/pages/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
    const campaignUrls = campaigns.filter(campaign => campaign.slug).map(campaign => ({
      url: `${baseUrl}/campaigns/${campaign.slug}`,
      lastModified: campaign.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...routes, ...collectionUrls, ...productUrls, ...pageUrls, ...campaignUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [{ url: baseUrl, lastModified: new Date() }]
  }
}
