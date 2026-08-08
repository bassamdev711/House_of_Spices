'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Minus, Plus } from 'lucide-react'

import { useCart } from '@/components/CartProvider'

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
  stock: number
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const allImages = [product.imageUrl, ...product.images].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState(allImages[0] || '')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('نعتذر، هذا المنتج نفد من المخزون.')
      return
    }
    if (quantity > product.stock) {
      alert(`عذراً، المتوفر في المخزون هو ${product.stock} فقط.`)
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl || '',
      quantity,
    })
    
    // Optional: show a nice toast, but for now alert works or we just let them know.
    // We can just log or show a minimal alert.
    alert(`تمت إضافة ${quantity} من ${product.name} إلى السلة!`)
  }

  return (
    <div className="relative min-h-[80vh] bg-ivory text-deep-green pb-24 md:pb-0" dir="rtl">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
        
        {/* ======= Left: Image Gallery ======= */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          
          {/* Main Image Stage */}
          <div className="w-full aspect-[4/5] bg-white relative overflow-hidden border border-black/5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center p-8"
              >
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain mix-blend-multiply p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <Sparkles className="w-16 h-16 text-gold/20" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 shrink-0 border-2 overflow-hidden transition-all bg-white ${
                    activeImage === img 
                      ? 'border-emerald opacity-100' 
                      : 'border-black/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img} alt={`صورة ${i + 1}`} fill className="object-cover mix-blend-multiply p-2" sizes="80px" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ======= Right: Product Info ======= */}
        <div className="w-full md:w-1/2 flex flex-col text-center md:text-right pt-4 lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand */}
            {product.brand && (
              <p className="text-gold text-xs tracking-widest uppercase font-bold mb-3">
                {product.brand}
              </p>
            )}

            {/* Name */}
            <h1 className="text-3xl md:text-5xl font-black text-deep-green mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <span className="text-3xl font-bold text-emerald">
                {Number(product.price).toLocaleString('ar-SA')} ر.س
              </span>
              {product.compareAtPrice && (
                <span className="text-deep-green/40 text-lg line-through">
                  {Number(product.compareAtPrice).toLocaleString('ar-SA')} ر.س
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-deep-green/70 text-base leading-relaxed mb-10">
                {product.description}
              </p>
            )}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 text-sm">
              {product.size && (
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-deep-green/50 font-bold">الحجم</span>
                  <span className="text-deep-green" dir="ltr">{product.size}</span>
                </div>
              )}
              {product.gender && (
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-deep-green/50 font-bold">الجنس</span>
                  <span className="text-deep-green">{product.gender}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-deep-green/50 font-bold">التصنيف</span>
                  <span className="text-deep-green">{product.category}</span>
                </div>
              )}
            </div>

            {/* Desktop Add to Cart (hidden on mobile) */}
            <div className="hidden md:flex gap-4 items-center">
              <div className="flex items-center border border-black/10 h-14 w-32 shrink-0 rounded-none overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-deep-green hover:bg-black/5 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center font-bold text-deep-green">{quantity}</div>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-full flex items-center justify-center text-deep-green hover:bg-black/5 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gold text-deep-green border border-black h-14 font-bold tracking-wide hover:bg-[#c9a756] transition-colors duration-300 rounded-none flex items-center justify-center uppercase"
              >
                أضف إلى السلة
              </button>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom Bar (Add to Cart) for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ivory/95 backdrop-blur-md border-t border-black/10 p-4 flex gap-4 z-50 shadow-[0_-4px_40px_rgba(18,60,53,0.1)]" dir="rtl">
        <div className="flex items-center border border-black/10 h-12 w-32 shrink-0 rounded-none overflow-hidden bg-white">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-full flex items-center justify-center text-deep-green active:bg-black/5"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 text-center font-bold text-deep-green">{quantity}</div>
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-full flex items-center justify-center text-deep-green active:bg-black/5"
          >
            <Plus size={14} />
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-gold text-deep-green border border-black h-12 font-bold hover:bg-[#c9a756] transition-colors duration-300 rounded-none flex items-center justify-center uppercase"
        >
          أضف إلى السلة
        </button>
      </div>
    </div>
  )
}
