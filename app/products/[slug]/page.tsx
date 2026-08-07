import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
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
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug, isActive: true } })
  if (!product) notFound()

  // Related products
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
  })

  return (
    <main className="min-h-screen bg-[#050b14] text-white font-sans">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-28 pb-0 px-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/30">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <Link href="/products" className="hover:text-white transition-colors">المجموعة</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <span className="text-white/60">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ProductDetailClient
            product={{
              ...product,
              price: Number(product.price),
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            }}
          />
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-20 px-6 border-t border-white/10" dir="rtl">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-10">قد يعجبك أيضاً</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group border border-white/10 hover:border-light-beam/40 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-square bg-[#0a1630]">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl">✦</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm group-hover:text-light-beam transition-colors mb-1">
                      {p.name}
                    </h3>
                    <p className="text-white/50 text-xs">{Number(p.price).toLocaleString('ar-YE')} YER</p>
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
