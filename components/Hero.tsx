"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToProducts = () => {
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen overflow-hidden bg-ivory">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center pt-24 lg:pt-0 min-h-screen" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full relative z-10">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center lg:text-right mt-10 lg:mt-0"
          >
            <span className="text-gold tracking-[0.4em] uppercase text-xs md:text-sm font-bold mb-6 block">
              العطر الذي يعكس هويتك
            </span>
            <h1 className="flex flex-col gap-2 mb-8">
              <span className="text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tight text-deep-green leading-none">
                طيف
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-light text-emerald leading-tight mt-2">
                حضور لا يُنسى.
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-deep-green/70 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12">
              اكتشف مجموعتنا الحصرية من العطور الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً.
            </p>

            <div className="flex flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProducts}
                className="px-8 md:px-12 py-4 md:py-5 bg-emerald text-ivory font-bold text-sm md:text-base rounded-sm hover:bg-deep-green transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-emerald/20"
              >
                اكتشف المجموعة
              </button>
              <button className="px-8 md:px-12 py-4 md:py-5 border border-emerald/20 text-emerald font-bold text-sm md:text-base rounded-sm hover:bg-emerald/5 transition-all duration-300">
                قصة طيف
              </button>
            </div>
          </motion.div>

          {/* Elegant 2D Visual Presentation */}
          <div className="relative h-[450px] lg:h-[650px] w-full flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative w-full max-w-[400px] h-full"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 border border-gold/30 rounded-t-full translate-x-4 translate-y-4" />
              
              {/* Image Container */}
              <div className="absolute inset-0 bg-emerald rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-end pb-20">
                {/* Simulated Perfume Bottle (CSS Art) */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative w-[180px] h-[260px] flex flex-col items-center z-10"
                >
                  {/* Cap */}
                  <div className="w-16 h-12 bg-gradient-to-b from-gold via-[#e6c875] to-[#a68239] rounded-t-xl mb-1 shadow-md z-20" />
                  {/* Neck */}
                  <div className="w-8 h-4 bg-gold/80 mb-1 z-20" />
                  {/* Bottle Body */}
                  <div className="w-full flex-1 bg-gradient-to-b from-[#1a544a] to-[#0f302a] rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                    
                    {/* Label */}
                    <div className="w-24 h-24 bg-ivory/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-gold/20">
                      <span className="text-emerald font-black text-2xl">طيف</span>
                      <div className="w-6 h-[1px] bg-gold my-2" />
                      <span className="text-deep-green text-[8px] tracking-[0.2em] uppercase">EAU DE PARFUM</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Decorative Typography behind bottle */}
                <span className="absolute top-1/4 -right-10 text-[10rem] font-serif text-ivory/5 rotate-90 select-none pointer-events-none">
                  TIF
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
