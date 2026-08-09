"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import OrderButton from './OrderButton';
import { getImageSizes } from '@/lib/image-utils';

const products = [
  {
    id: "sapphire-glow",
    name: "وهج الياقوت",
    engName: "Sapphire Glow",
    description: "نفحات باردة من البرغموت والمسك الأبيض.",
    price: "35$",
    code: "TIF-SA01",
    color: "أزرق ياقوتي",
    size: "100 مل",
    gradient: "from-blue-900/40 to-cyan-800/40",
    image: "/imeg/photo_1_2026-05-13_05-39-00.jpg"
  },
  {
    id: "sky-beam",
    name: "شعاع السماء",
    engName: "Sky Beam",
    description: "عطر سماوي يجمع بين زهرة اللوتس والياسمين.",
    price: "40$",
    code: "TIF-SK02",
    color: "أبيض سماوي",
    size: "100 مل",
    gradient: "from-sky-900/40 to-blue-800/40",
    image: "/imeg/photo_2_2026-05-13_05-39-00.jpg"
  },
  {
    id: "mirage",
    name: "سراب",
    engName: "Mirage",
    description: "دخان خفيف مع أخشاب الصندل الفاخرة.",
    price: "45$",
    code: "TIF-MI03",
    color: "أسود دخاني",
    size: "100 مل",
    gradient: "from-slate-900/40 to-zinc-800/40",
    image: "/imeg/photo_3_2026-05-13_05-39-00.jpg"
  },
  {
    id: "aether",
    name: "أثير",
    engName: "Aether",
    description: "عبير زهري خفيف مستوحى من نسمات الصباح الباكر.",
    price: "30$",
    code: "TIF-AE04",
    color: "ذهبي شفاف",
    size: "100 مل",
    gradient: "from-amber-900/40 to-yellow-800/40",
    image: "/imeg/photo_4_2026-05-13_05-39-00.jpg"
  },
  {
    id: "sultan",
    name: "سلطان",
    engName: "Sultan",
    description: "مزيج ملكي من العود الكمبودي والزعفران الأصيل.",
    price: "55$",
    code: "TIF-SU05",
    color: "أحمر ملكي",
    size: "100 مل",
    gradient: "from-red-900/40 to-orange-950/40",
    image: "/imeg/photo_5_2026-05-13_05-39-00.jpg"
  },
  {
    id: "star",
    name: "نجمة",
    engName: "Star",
    description: "عطر متلألئ يجمع بين الفانيليا وأزهار البرتقال الجذابة.",
    price: "38$",
    code: "TIF-ST06",
    color: "بنفسجي ليلي",
    size: "100 مل",
    gradient: "from-purple-900/40 to-indigo-950/40",
    image: "/imeg/photo_6_2026-05-13_05-39-00.jpg"
  }
];

const Products = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedId);

  return (
    <section id="products" className="py-32 px-6 bg-[#050b14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">المجموعة الحصرية</h2>
          <div className="w-24 h-1 bg-light-beam mx-auto" />
        </motion.div>

        {/* Desktop Grid / Mobile Slider Container */}
        <div className="relative">
          {/* Mobile Slider View */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 no-scrollbar px-6">
            {products.map((product, index) => (
              <motion.div
                key={`mobile-${product.id}`}
                onClick={() => setSelectedId(product.id)}
                className={`relative min-w-[85vw] h-[500px] snap-center rounded-none overflow-hidden bg-gradient-to-b ${product.gradient} border border-white/10`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    // البطاقة الأولى priority، الباقي lazy
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    sizes={getImageSizes('card-mobile')}
                    className="object-cover opacity-60"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient} opacity-70`} />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-8 text-center">
                  <Sparkles className="w-6 h-6 text-light-beam mb-3" />
                  <h3 className="text-3xl font-black text-white mb-1">{product.name}</h3>
                  <p className="text-light-beam/60 text-xs mb-3">{product.engName}</p>
                  <p className="text-crystal-silver/80 text-xs mb-8 line-clamp-2">{product.description}</p>
                  <button className="w-full py-3 border border-white/20 text-white font-bold text-sm bg-white/5 backdrop-blur-md">
                    اكتشف العطر
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swipe Hint (Mobile Only) */}
          <div className="md:hidden flex justify-center items-center gap-2 mb-8 text-white/30 text-[10px] uppercase tracking-[0.2em]">
            <span>اسحب للاكتشاف</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ←
            </motion.div>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={`desktop-${product.id}`}
                layoutId={product.id}
                onClick={() => setSelectedId(product.id)}
                className={`relative h-[550px] rounded-none overflow-hidden cursor-pointer group border border-white/10 backdrop-blur-md`}
                whileHover={{ y: -10 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    // البطاقة الأولى priority، الباقي lazy
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    sizes={getImageSizes('card-hero')}
                    className="object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient} opacity-60`} />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-8 text-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                  <motion.div className="mb-4 text-light-beam">
                    <Sparkles className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-2">{product.name}</h3>
                  <p className="text-light-beam/60 text-sm mb-4">{product.engName}</p>
                  <p className="text-crystal-silver/80 text-sm mb-8 line-clamp-2">{product.description}</p>

                  <button className="px-8 py-3 border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition-all duration-300">
                    اكتشف العطر
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Overlay */}
        <AnimatePresence>
          {selectedId && selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-black/98 md:backdrop-blur-2xl"
              />
              
              <motion.div 
                layoutId={selectedId}
                className="relative w-full h-full md:h-auto md:max-w-5xl bg-[#050b14] md:bg-midnight-blue border-none md:border md:border-white/10 overflow-y-auto no-scrollbar flex flex-col md:flex-row shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedId(null)}
                  className="fixed top-6 left-6 z-[120] text-white/50 hover:text-white transition-colors bg-black/40 p-3 backdrop-blur-lg rounded-full"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Visual Side — تُحم-ّل فقط بعد فتح المودال */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-auto bg-gradient-to-br from-black to-transparent relative overflow-hidden shrink-0">
                   <motion.div 
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-full h-full"
                   >
                     <Image 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      fill
                      priority
                      sizes={getImageSizes('detail')}
                      className="object-cover block"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent md:hidden" />
                   </motion.div>
                </div>

                {/* Details Side */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center text-right bg-[#050b14] md:bg-[#0a1630] relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-light-beam font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block">إصدار حصري</span>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-4 leading-none">{selectedProduct.name}</h3>
                    <p className="text-crystal-silver/80 text-base md:text-lg mb-10 leading-relaxed font-medium">
                      {selectedProduct.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-12 border-y border-white/5 py-10">
                      <div>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest block mb-2">السعر التقديري</span>
                        <span className="text-white font-bold text-3xl">{selectedProduct.price}</span>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest block mb-2">كود المنتج</span>
                        <span className="text-white font-bold text-3xl">{selectedProduct.code}</span>
                      </div>
                    </div>

                    <div className="pb-10 md:pb-0">
                      <OrderButton product={{
                        productName: selectedProduct.name,
                        price: selectedProduct.price,
                        code: selectedProduct.code,
                        selectedColor: selectedProduct.color,
                        selectedSize: selectedProduct.size
                      }} />
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
};

export default Products;
