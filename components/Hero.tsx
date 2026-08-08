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
    <section id="hero" className="relative w-full min-h-[100dvh] overflow-hidden bg-ivory">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 min-h-[100dvh] flex flex-col pt-32 lg:pt-40 pb-16 lg:pb-20 relative z-10" dir="rtl">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-24 items-center w-full my-auto">
          
          {/* 1. Text Content (Order 1 on Mobile & Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col text-center lg:text-right order-1 w-full max-w-xl mx-auto lg:mx-0"
          >
            <span className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm font-bold mb-4 lg:mb-6 block">
              العطر الذي يعكس هويتك
            </span>
            <h1 className="flex flex-col gap-2 mb-6 lg:mb-8">
              <span className="text-6xl md:text-7xl lg:text-[7rem] font-black text-deep-green leading-none tracking-tight">
                طيف
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-light text-emerald leading-tight mt-1 lg:mt-2">
                حضور لا يُنسى.
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-deep-green/70 font-light leading-relaxed mb-0 lg:mb-12">
              اكتشف مجموعتنا الحصرية من العطور الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً.
            </p>

            {/* Desktop Buttons (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-row gap-5 justify-start">
              <button
                onClick={scrollToProducts}
                className="px-10 xl:px-12 py-4 xl:py-5 bg-emerald text-ivory font-bold text-sm xl:text-base rounded-sm hover:bg-deep-green transition-all duration-500 transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(26,84,74,0.3)]"
              >
                اكتشف المجموعة
              </button>
              <button className="px-10 xl:px-12 py-4 xl:py-5 border border-emerald/20 text-emerald font-bold text-sm xl:text-base rounded-sm hover:bg-emerald/5 hover:border-emerald/40 transition-all duration-500">
                قصة طيف
              </button>
            </div>
          </motion.div>

          {/* 2. Visual Presentation (Order 2 on Mobile & Desktop) */}
          <div className="order-2 flex flex-col items-center lg:items-end w-full relative mt-4 lg:mt-0">
            
            {/* The Bottle Composition Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[420px] h-[380px] sm:h-[450px] lg:h-[550px] xl:h-[600px] flex-shrink-0"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 border border-gold/30 rounded-t-full translate-x-3 translate-y-3 lg:translate-x-5 lg:translate-y-5 transition-transform duration-700 hover:translate-x-4 hover:translate-y-4" />
              
              {/* Image Container */}
              <div className="absolute inset-0 bg-emerald rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-end pb-16 lg:pb-24">
                
                {/* Simulated Perfume Bottle (CSS Art) */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative w-[130px] sm:w-[150px] lg:w-[170px] xl:w-[190px] h-[190px] sm:h-[220px] lg:h-[250px] xl:h-[280px] flex flex-col items-center z-10"
                >
                  {/* Cap */}
                  <div className="w-12 sm:w-14 lg:w-16 h-10 sm:h-12 bg-gradient-to-b from-gold via-[#e6c875] to-[#a68239] rounded-t-xl mb-1 shadow-md z-20" />
                  {/* Neck */}
                  <div className="w-6 sm:w-8 h-3 sm:h-4 bg-gold/80 mb-1 z-20" />
                  {/* Bottle Body */}
                  <div className="w-full flex-1 bg-gradient-to-b from-[#1a544a] to-[#0f302a] rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                    
                    {/* Label */}
                    <div className="w-20 sm:w-24 h-20 sm:h-24 bg-ivory/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-gold/20">
                      <span className="text-emerald font-black text-xl sm:text-2xl">طيف</span>
                      <div className="w-6 h-[1px] bg-gold my-1 sm:my-2" />
                      <span className="text-deep-green text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-center leading-tight">EAU DE PARFUM</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Decorative Typography behind bottle */}
                <span className="absolute top-1/4 -right-10 text-[8rem] sm:text-[10rem] lg:text-[12rem] font-serif text-ivory/5 rotate-90 select-none pointer-events-none">
                  TIF
                </span>
              </div>
            </motion.div>

            {/* Mobile Buttons (Hidden on Desktop) */}
            {/* Perfectly aligned with the bottle composition max-width */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex lg:hidden flex-row justify-between gap-3 w-full max-w-[280px] sm:max-w-[320px] mt-8 z-20"
            >
              <button
                onClick={scrollToProducts}
                className="flex-1 py-4 bg-emerald text-ivory font-bold text-[13px] sm:text-sm rounded-sm hover:bg-deep-green transition-all shadow-[0_8px_25px_-8px_rgba(26,84,74,0.4)] active:scale-95"
              >
                اكتشف المجموعة
              </button>
              <button className="flex-1 py-4 border border-emerald/20 bg-transparent text-emerald font-bold text-[13px] sm:text-sm rounded-sm hover:bg-emerald/5 hover:border-emerald/40 transition-all active:scale-95">
                قصة طيف
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
