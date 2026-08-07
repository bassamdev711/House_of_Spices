'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react'

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
    <div className="relative min-h-[80vh] bg-ivory text-deep-green" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* ======= Left: Image Gallery ======= */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-32">
          
          {/* Main Image Stage */}
          <div className="relative w-full aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5] xl:aspect-[16/11] overflow-hidden bg-[#F9F7F2] border border-black/5 flex items-center justify-center p-8 group">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center z-10"
              >
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain drop-shadow-xl scale-95 group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gold/20" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
              {product.featured && (
                <span className="bg-white/80 backdrop-blur-sm border border-gold/30 text-emerald text-[10px] font-bold px-4 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
                  إصدار مميز
                </span>
              )}
              {product.bestseller && (
                <span className="bg-gold text-ivory text-[10px] font-bold px-4 py-1.5 rounded-sm tracking-widest uppercase shadow-sm">
                  الأكثر مبيعاً
                </span>
              )}
            </div>

            {discount && (
              <div className="absolute top-6 left-6 z-20 bg-emerald text-ivory text-sm font-black px-4 py-1.5 rounded-sm shadow-md">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 shrink-0 overflow-hidden border-2 transition-all duration-300 ease-out bg-white ${
                    activeImage === img 
                      ? 'border-emerald shadow-md scale-100 opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105 hover:border-emerald/30'
                  }`}
                >
                  <Image src={img} alt={`صورة ${i + 1}`} fill className="object-cover mix-blend-multiply" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ======= Right: Product Info ======= */}
        <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Brand */}
            {product.brand && (
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gold block"></span>
                {product.brand}
              </p>
            )}

            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-deep-green leading-[1.1] mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl md:text-5xl font-black text-emerald">
                {Number(product.price).toLocaleString('ar-YE')}
              </span>
              <span className="text-emerald/60 text-xl font-light mb-1">YER</span>
              {product.compareAtPrice && (
                <span className="text-deep-green/30 text-xl line-through mb-1 ml-4 font-light">
                  {Number(product.compareAtPrice).toLocaleString('ar-YE')}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white border border-black/5 rounded-sm p-6 mb-8 shadow-sm">
                <p className="text-deep-green/80 text-base leading-relaxed font-light">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-6 mb-10 py-6 border-y border-black/5">
              {[
                { label: 'الحجم', value: product.size, ltr: true },
                { label: 'الجنس', value: product.gender ? genderLabel[product.gender] || product.gender : null },
                { label: 'التصنيف', value: product.category },
              ].map((spec, i) => spec.value && (
                <div key={i} className="flex flex-col gap-2 border-l border-black/5 last:border-l-0 pl-4 last:pl-0">
                  <span className="text-deep-green/40 text-[10px] tracking-widest uppercase font-bold">{spec.label}</span>
                  <span className="text-deep-green font-medium text-sm md:text-base" dir={spec.ltr ? 'ltr' : 'rtl'}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Area */}
            <div className="space-y-4 mb-12">
              <a
                href={`https://wa.me/967000000000?text=${encodeURIComponent(`مرحباً، أريد طلب عطر:\n\n*${product.name}*\nالسعر: ${Number(product.price).toLocaleString('ar-YE')} YER\nالرابط: https://tif-perfumes.com/products/${product.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full flex items-center justify-center h-16 bg-emerald text-ivory rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-deep-green"
              >
                <span className="font-bold text-lg flex items-center gap-3 relative z-10">
                  اطلب الآن عبر واتساب
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </a>
              <p className="text-center text-deep-green/40 text-xs font-medium">
                دفع آمن عند الاستلام • سيتم التواصل لتأكيد الطلب
              </p>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 bg-white border border-black/5 p-6 rounded-sm shadow-sm">
              {[
                { icon: ShieldCheck, title: 'ضمان الجودة', desc: 'عطور أصلية ومضمونة 100%' },
                { icon: Truck, title: 'توصيل سريع', desc: 'توصيل داخل اليمن بأسرع وقت' },
                { icon: Clock, title: 'دعم فني', desc: 'متواجدون للرد على استفساراتكم' },
              ].map((Feature, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="text-gold">
                    <Feature.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-deep-green text-sm font-bold mb-1">{Feature.title}</h4>
                    <p className="text-deep-green/50 text-[11px] font-medium">{Feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
