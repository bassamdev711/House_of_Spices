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

      {/* ── DESKTOP LAYOUT (lg and above) ── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[100dvh] relative z-10" dir="rtl">

        {/* RIGHT: Text — vertically centered, with padding to clear navbar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col justify-center text-right px-12 xl:px-20 pt-20 pb-16 max-w-2xl ml-auto"
        >
          <span className="text-gold tracking-[0.3em] uppercase text-sm font-bold mb-6 block">
            العطر الذي يعكس هويتك
          </span>
          <h1 className="flex flex-col gap-2 mb-8">
            <span className="text-[7rem] xl:text-[8rem] font-black text-deep-green leading-none tracking-tight">
              طيف
            </span>
            <span className="text-3xl xl:text-4xl font-light text-emerald leading-tight mt-2">
              حضور لا يُنسى.
            </span>
          </h1>

          <p className="text-lg xl:text-xl text-deep-green/70 font-light leading-relaxed mb-12 max-w-lg">
            اكتشف مجموعتنا الحصرية من العطور الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً.
          </p>

          <div className="flex flex-row gap-5 justify-start">
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

        {/* LEFT: Bottle — fills full height from top to bottom, no padding */}
        <div className="relative flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[420px] xl:max-w-[480px] h-full min-h-[100dvh]"
          >
            {/* Decorative Frame */}
            <div className="absolute inset-x-4 top-4 bottom-0 border border-gold/20 rounded-t-full pointer-events-none" />

            {/* Green Bottle Container — full height, flush to top */}
            <div className="absolute top-[30px] bg-emerald rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              {/* Floating Bottle */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-[170px] xl:w-[200px] h-[250px] xl:h-[290px] flex flex-col items-center z-10"
              >
                {/* Cap */}
                <div className="w-14 xl:w-16 h-11 xl:h-12 bg-gradient-to-b from-gold via-[#e6c875] to-[#a68239] rounded-t-xl mb-1 shadow-md z-20" />
                {/* Neck */}
                <div className="w-7 xl:w-8 h-4 bg-gold/80 mb-1 z-20" />
                {/* Bottle Body */}
                <div className="w-full flex-1 bg-gradient-to-b from-[#1a544a] to-[#0f302a] rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                  {/* Glass Reflection */}
                  <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  {/* Label */}
                  <div className="w-24 h-24 bg-ivory/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-gold/20">
                    <span className="text-emerald font-black text-2xl">طيف</span>
                    <div className="w-6 h-[1px] bg-gold my-2" />
                    <span className="text-deep-green text-[8px] tracking-[0.2em] uppercase text-center leading-tight">EAU DE PARFUM</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Typography */}
              <span className="absolute top-1/4 -right-10 text-[12rem] font-serif text-ivory/5 rotate-90 select-none pointer-events-none">
                TIF
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (below lg) ── */}
      <div className="flex lg:hidden flex-col min-h-[100dvh] relative z-10 pt-28 pb-10 px-6" dir="rtl">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col text-center w-full max-w-md mx-auto mb-8"
        >
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
            العطر الذي يعكس هويتك
          </span>
          <h1 className="flex flex-col gap-2 mb-5">
            <span className="text-6xl sm:text-7xl font-black text-deep-green leading-none tracking-tight">
              طيف
            </span>
            <span className="text-2xl sm:text-3xl font-light text-emerald leading-tight mt-1">
              حضور لا يُنسى.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-deep-green/70 font-light leading-relaxed">
            اكتشف مجموعتنا الحصرية من العطور الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً.
          </p>
        </motion.div>

        {/* Bottle */}
        <div className="flex flex-col items-center flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] h-[350px] sm:h-[420px] flex-shrink-0"
          >
            <div className="absolute inset-x-3 top-3 bottom-0 border border-gold/25 rounded-t-full pointer-events-none" />
            <div className="absolute inset-0 bg-emerald rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-[130px] sm:w-[150px] h-[190px] sm:h-[220px] flex flex-col items-center z-10"
              >
                <div className="w-12 sm:w-14 h-10 sm:h-12 bg-gradient-to-b from-gold via-[#e6c875] to-[#a68239] rounded-t-xl mb-1 shadow-md z-20" />
                <div className="w-6 sm:w-8 h-3 sm:h-4 bg-gold/80 mb-1 z-20" />
                <div className="w-full flex-1 bg-gradient-to-b from-[#1a544a] to-[#0f302a] rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  <div className="w-20 sm:w-24 h-20 sm:h-24 bg-ivory/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-gold/20">
                    <span className="text-emerald font-black text-xl sm:text-2xl">طيف</span>
                    <div className="w-6 h-[1px] bg-gold my-1 sm:my-2" />
                    <span className="text-deep-green text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-center leading-tight">EAU DE PARFUM</span>
                  </div>
                </div>
              </motion.div>
              <span className="absolute top-1/4 -right-10 text-[8rem] sm:text-[10rem] font-serif text-ivory/5 rotate-90 select-none pointer-events-none">TIF</span>
            </div>
          </motion.div>

          {/* Mobile Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row justify-between gap-3 w-full max-w-[280px] sm:max-w-[320px] mt-7"
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
    </section>
  );
}
