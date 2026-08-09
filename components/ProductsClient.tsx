"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { getImageSizes } from '@/lib/image-utils';

interface ProductItem {
  id: string
  name: string
  engName: string
  description: string
  price: string
  code: string
  color: string
  size: string
  gradient: string
  image: string
  slug: string
  rawPrice?: number
  compareAtPrice?: number
}

export default function ProductsClient({ products, title, subtitle, type }: { products: ProductItem[], title?: string, subtitle?: string, type?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = products.find(p => p.id === selectedId);
  const { addToCart } = useCart();

  const handleAddToCart = (product: ProductItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.rawPrice || 0,
      imageUrl: product.image,
      quantity: 1,
    });
    alert(`تمت إضافة ${product.name} إلى السلة!`);
  };

  return (
    <section id={type || "products"} className={`py-24 px-6 ${type === 'offers' ? 'bg-[#F9F7F2]' : 'bg-ivory'} relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
            {subtitle || "المجموعة الحصرية"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-green mb-6">{title || "اكتشف عطورنا"}</h2>
          <div className="w-16 h-[2px] bg-emerald mx-auto mb-8" />
          <Link
            href="/products"
            className="inline-block text-sm text-emerald border-b border-emerald/30 pb-1 hover:border-emerald transition-colors"
          >
            عرض المجموعة كاملة ←
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center text-deep-green/40 py-20 text-lg font-light">
            لم يتم إضافة منتجات مميزة بعد
          </div>
        ) : (
          <div className="relative">
            {/* Mobile Slider */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar px-2">
              {products.map((product, index) => (
                <motion.div
                  key={`mobile-${product.id}`}
                  onClick={() => setSelectedId(product.id)}
                  className="relative min-w-[85vw] h-[480px] snap-center bg-white shadow-sm hover:shadow-md border border-black/10 rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
                >
                  <div className="relative w-full h-[65%] bg-ivory/50 p-8 flex items-center justify-center">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        // البطاقة الأولى priority، الباقي lazy
                        priority={index === 0}
                        loading={index === 0 ? undefined : 'lazy'}
                        sizes={getImageSizes('card-mobile')}
                        className="object-contain p-6 mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold/30 text-4xl">طيف</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white z-10 border-t border-black/5">
                    <h3 className="text-2xl font-black text-deep-green mb-1">{product.name}</h3>
                    <p className="text-gold text-xs tracking-widest uppercase mb-3">{product.engName}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-emerald font-bold text-lg">{product.price}</p>
                      {product.compareAtPrice && (
                        <p className="text-deep-green/40 line-through text-sm">{Number(product.compareAtPrice).toLocaleString('ar-SA')} ر.س</p>
                      )}
                    </div>
                    <button className="text-xs font-bold uppercase tracking-wider text-emerald border-b border-emerald pb-1">
                      اكتشف العطر
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={`desktop-${product.id}`}
                  layoutId={product.id}
                  onClick={() => setSelectedId(product.id)}
                  className="relative h-[550px] bg-white cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 border border-black/10 rounded-2xl flex flex-col overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative w-full h-[65%] bg-ivory/50 transition-colors duration-500 group-hover:bg-[#F2EFE8] flex items-center justify-center p-8">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        // البطاقة الأولى priority، الباقي lazy — يمنع تحميل 6 صور دفعة واحدة
                        priority={index === 0}
                        loading={index === 0 ? undefined : 'lazy'}
                        sizes={getImageSizes('card-hero')}
                        className="object-contain p-8 mix-blend-multiply scale-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold/20 text-6xl group-hover:text-gold/40 transition-colors">طيف</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white z-10 border-t border-black/5">
                    <h3 className="text-2xl font-black text-deep-green mb-2">{product.name}</h3>
                    <p className="text-gold text-xs tracking-[0.2em] uppercase">{product.engName}</p>
                    
                    <div className="flex items-center gap-2 my-4">
                      <p className="text-emerald font-bold text-lg">{product.price}</p>
                      {product.compareAtPrice && (
                        <p className="text-deep-green/40 line-through text-sm">{Number(product.compareAtPrice).toLocaleString('ar-SA')} ر.س</p>
                      )}
                    </div>
                    
                    <button className="text-xs font-bold uppercase tracking-widest text-emerald border-b border-emerald/30 group-hover:border-emerald pb-1 transition-colors">
                      اكتشف العطر
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Overlay */}
        <AnimatePresence>
          {selectedId && selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-deep-green/90 backdrop-blur-sm"
              />
              <motion.div
                layoutId={selectedId}
                className="relative w-full h-full md:h-auto md:max-w-5xl bg-ivory md:rounded-sm overflow-y-auto no-scrollbar flex flex-col md:flex-row shadow-2xl"
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 left-6 z-[120] text-deep-green/50 hover:text-deep-green transition-colors bg-black/5 p-3 rounded-full"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Image — تُحم-ّل فقط بعد فتح المودال (selectedId !== null) */}
                <div className="w-full md:w-1/2 h-[45vh] md:h-auto bg-[#F9F7F2] relative overflow-hidden shrink-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative w-full h-full"
                  >
                    {selectedProduct.image ? (
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        priority
                        sizes={getImageSizes('detail')}
                        className="object-contain p-12 mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gold/20 text-6xl">طيف</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-right bg-white relative z-10 border-l border-black/5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-gold font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block">إصدار حصري</span>
                    <h3 className="text-4xl md:text-5xl font-black text-deep-green mb-4 leading-none">{selectedProduct.name}</h3>
                    <p className="text-deep-green/60 text-base md:text-lg mb-10 leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6 mb-12 border-y border-black/5 py-8">
                      <div>
                        <span className="text-deep-green/40 text-[10px] uppercase tracking-widest block mb-2 font-bold">السعر</span>
                        <span className="text-deep-green font-bold text-2xl">{selectedProduct.price}</span>
                      </div>
                      <div>
                        <span className="text-deep-green/40 text-[10px] uppercase tracking-widest block mb-2 font-bold">كود المنتج</span>
                        <span className="text-deep-green font-bold text-2xl">{selectedProduct.code}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 pb-10 md:pb-0">
                      <button 
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="w-full bg-gold text-deep-green border border-black h-14 font-bold tracking-wide hover:bg-[#c9a756] transition-colors duration-300 rounded-sm flex items-center justify-center uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                      >
                        أضف إلى السلة
                      </button>
                      <Link
                        href={`/products/${selectedProduct.slug}`}
                        className="w-full flex items-center justify-center border border-emerald text-emerald font-bold text-sm py-4 hover:bg-emerald/5 transition-all duration-300 rounded-sm"
                        onClick={() => setSelectedId(null)}
                      >
                        عرض التفاصيل الكاملة
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

