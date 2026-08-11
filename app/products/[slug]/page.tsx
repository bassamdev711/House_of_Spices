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
  return {
    title: `${product.name} | TIF طيف`,
    description: product.description || `اكتشف ${product.name} من عطور طيف`,
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
      OR: [
        { gender: product.gender ?? undefined },
        { category: product.category ?? undefined },
      ],
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

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 lg:pt-24 pb-2 px-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-deep-green/50 font-medium">
            <Link href="/" className="hover:text-emerald transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <Link href="/products" className="hover:text-emerald transition-colors">المجموعة</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <span className="text-emerald font-bold">{product.name}</span>
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
            <h2 className="text-3xl font-black text-deep-green mb-10 text-center">قد يعجبك أيضاً</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white border border-black/10 hover:border-emerald/40 transition-all duration-500 overflow-hidden rounded-2xl shadow-sm hover:shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-ivory/50 flex items-center justify-center p-6">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        loading="lazy"
                        sizes={getImageSizes('related')}
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="text-gold/20 text-4xl">طيف</div>
                    )}
                  </div>
                  <div className="p-4 text-center border-t border-black/5 bg-white flex-1 flex flex-col justify-center">
                    <h3 className="text-deep-green font-bold text-sm group-hover:text-emerald transition-colors mb-2">
                      {p.name}
                    </h3>
                    <p className="text-emerald font-bold">{Number(p.price).toLocaleString('ar-SA')} {currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
