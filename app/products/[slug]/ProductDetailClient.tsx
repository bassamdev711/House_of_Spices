'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  price: number
  compareAtPrice: number | null
  size: string | null
  gender: string | null
  category: string | null
  imageUrl: string | null
  images: string[]
  featured: boolean
  bestseller: boolean
}

const genderLabel: Record<string, string> = {
  Men: 'رجالي',
  Women: 'نسائي',
  Unisex: 'للجميع',
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const allImages = [product.imageUrl, ...product.images].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState(allImages[0] || '')

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start" dir="rtl">
      {/* ======= Left: Image Gallery ======= */}
      <div className="space-y-4 lg:sticky lg:top-28">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#0a1630] to-[#050b14] border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-light-beam/20" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1">
              -{discount}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-20 overflow-hidden border-2 transition-all duration-300 ${
                  activeImage === img ? 'border-light-beam scale-105' : 'border-white/20 hover:border-white/60'
                }`}
              >
                <Image src={img} alt={`صورة ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ======= Right: Product Info ======= */}
      <div className="space-y-8">
        {/* Brand & Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {product.brand && (
            <span className="text-light-beam text-xs tracking-[0.3em] uppercase font-bold">
              {product.brand}
            </span>
          )}
          {product.featured && (
            <span className="bg-light-beam/20 border border-light-beam/30 text-light-beam text-xs font-bold px-3 py-1 tracking-wider">
              مميز
            </span>
          )}
          {product.bestseller && (
            <span className="bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1 tracking-wider">
              الأكثر مبيعاً
            </span>
          )}
        </div>

        {/* Name */}
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-crystal-silver/70 text-lg leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-black text-white">
            {Number(product.price).toLocaleString('ar-YE')}
          </span>
          <span className="text-white/50 text-lg">YER</span>
          {product.compareAtPrice && (
            <span className="text-white/30 text-xl line-through">
              {Number(product.compareAtPrice).toLocaleString('ar-YE')}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Specs */}
        <div className="grid grid-cols-2 gap-6">
          {product.size && (
            <div>
              <p className="text-white/30 text-xs tracking-widest uppercase mb-1">الحجم</p>
              <p className="text-white font-semibold" dir="ltr">{product.size}</p>
            </div>
          )}
          {product.gender && (
            <div>
              <p className="text-white/30 text-xs tracking-widest uppercase mb-1">الجنس</p>
              <p className="text-white font-semibold">{genderLabel[product.gender] || product.gender}</p>
            </div>
          )}
          {product.category && (
            <div>
              <p className="text-white/30 text-xs tracking-widest uppercase mb-1">التصنيف</p>
              <p className="text-white font-semibold">{product.category}</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* CTA */}
        <div className="space-y-4">
          <a
            href={`https://wa.me/967000000000?text=${encodeURIComponent(`أريد طلب: ${product.name} — السعر: ${Number(product.price).toLocaleString('ar-YE')} YER`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-light-beam text-[#050b14] font-black text-lg py-4 px-8 hover:bg-white transition-colors duration-300"
          >
            <span>اطلب الآن عبر واتساب</span>
          </a>
          <p className="text-center text-white/30 text-xs">
            سيتم التواصل معك لتأكيد الطلب وترتيب التوصيل
          </p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
          {[
            { icon: '✦', label: 'منتج أصلي 100%' },
            { icon: '✦', label: 'توصيل سريع' },
            { icon: '✦', label: 'ضمان الجودة' },
          ].map((g) => (
            <div key={g.label} className="space-y-1">
              <p className="text-light-beam text-lg">{g.icon}</p>
              <p className="text-white/40 text-xs">{g.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
