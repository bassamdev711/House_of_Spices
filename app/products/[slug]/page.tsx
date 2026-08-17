import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductDetailClient from './ProductDetailClient'
import ProductReviews from '@/components/ProductReviews'
import { getImageSizes } from '@/lib/image-utils'
import { getCurrency } from '@/lib/currency'
import ProductCard from '@/components/ProductCard'
import { generateProductSchema } from '@/lib/seo/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const product = await prisma.product.findUnique({ where: { slug: decodedSlug } })
  if (!product) return {}
  const productUrl = `${siteUrl}/products/${encodeURIComponent(product.slug)}`
  return {
    title: `${product.name} | بيت البهارات`,
    description: product.description || `اكتشف ${product.name} من توابل بيت البهارات`,
    alternates: { canonical: productUrl },
    openGraph: {
      title: `${product.name} | بيت البهارات`,
      description: product.description || `اكتشف ${product.name} من توابل بيت البهارات`,
      url: productUrl,
      type: 'website',
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const currency = await getCurrency()

  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const product = await prisma.product.findUnique({ 
    where: { slug: decodedSlug, isActive: true },
    include: { variants: true }
  })
  if (!product) notFound()

  // المنتجات المرتبطة — حقول أساسية فقط (لا حاجة للوصف أو المخزون)
  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      ...(product.category ? { category: product.category } : {}),
    },
    take: 4,
    orderBy: { featured: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      imageUrl: true,
    },
  })

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || undefined,
    image: product.imageUrl || undefined,
    sku: product.sku || undefined,
    brand: product.brand || undefined,
    price: Number(product.price),
    currency,
    url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
    inStock: product.stock > 0 || product.variants.some(variant => variant.stock > 0),
  })

  return (
    <main className="min-h-screen bg-surface text-foreground font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 lg:pt-24 pb-2 px-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-foreground/50 font-medium">
            <Link href="/" className="hover:text-brand transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <Link href="/products" className="hover:text-brand transition-colors">المجموعة</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <span className="text-brand font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-2 px-6">
        <div className="max-w-5xl mx-auto">
          <ProductDetailClient
            product={{
              ...product,
              price: Number(product.price),
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              variants: product.variants.map(v => ({
                ...v,
                price: Number(v.price),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
              }))
            }}
          />
        </div>
      </section>

      {/* Product Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-20 px-6 border-t border-black/5 bg-white" dir="rtl">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 md:mb-10 text-center">قد يعجبك أيضاً</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {related.map((p) => (
                <ProductCard 
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: Number(p.price),
                    compareAtPrice: null,
                    imageUrl: p.imageUrl || '',
                  }}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
