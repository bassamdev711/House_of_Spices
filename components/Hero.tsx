"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero({ data = {} }: { data?: any }) {
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
    <section id="hero" className="relative w-full min-h-[100dvh] overflow-hidden bg-surface">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />

      {/* ── DESKTOP LAYOUT (lg and above) ── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[100dvh] relative z-10" dir="rtl">

        {/* RIGHT: Text — vertically centered, with padding to clear navbar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col justify-center text-right px-12 xl:px-20 pt-20 pb-16 max-w-xl ml-auto"
        >
          {/* Layer 2: "طيف" — the visual anchor, dominant */}
          <h1 className="text-[6.5rem] xl:text-[7.5rem] font-black text-foreground leading-[0.88] tracking-tight mb-4">
            {data.heroTitle || "طيف"}
          </h1>

          {/* Layer 3: Secondary headline — clearly subordinate to "طيف" */}
          <p className="text-2xl xl:text-3xl font-light text-brand leading-snug tracking-wide mb-10">
            {data.heroSubtitle || "حضورٌ لا يُنسى."}
          </p>

          {/* Layer 4: Description — calm, small, max-width restrained */}
          <p className="text-sm xl:text-base text-foreground/60 font-light leading-loose max-w-sm mb-14 whitespace-pre-line">
            {data.heroDescription || "اكتشف مجموعتنا الحصرية من العطور الفاخرة،\nالمصممة بعناية لتمنحك تجربة حسية تدوم طويلًا."}
          </p>

          {/* Layer 5: CTA Buttons */}
          <div className="flex flex-row gap-4 justify-start">
            <button
              onClick={scrollToProducts}
              className="px-9 xl:px-11 py-4 bg-brand text-surface font-semibold text-sm rounded-sm hover:bg-foreground transition-all duration-500 transform hover:-translate-y-0.5 shadow-[0_8px_30px_-8px_color-mix(in_srgb,var(--color-brand)_35%,transparent)]"
            >
              {data.heroPrimaryButton || "اكتشف المجموعة"}
            </button>
            <button className="px-9 xl:px-11 py-4 border border-brand/20 text-brand font-semibold text-sm rounded-sm hover:bg-brand/5 hover:border-brand/35 transition-all duration-500">
              {data.heroSecondaryButton || "قصة طيف"}
            </button>
          </div>
        </motion.div>

        {/* LEFT: Bottle — positioned below header with explicit calculated height */}
        <div className="relative flex items-start justify-center overflow-hidden pt-[104px] pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[340px] xl:max-w-[400px] h-[calc(100dvh-128px)]"
          >
            {/* Decorative Frame */}
            <div className="absolute inset-x-4 top-4 bottom-0 border border-accent/20 rounded-t-full pointer-events-none" />

            {/* Green Bottle Container — fills parent, starts at top of padded column */}
            <div className="absolute inset-x-0 top-0 bottom-0 bg-brand rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              {/* Floating Bottle */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-[170px] xl:w-[200px] h-[250px] xl:h-[290px] flex flex-col items-center z-10"
              >
                {/* Cap */}
                <div className="w-14 xl:w-16 h-11 xl:h-12 bg-gradient-to-b from-accent via-bottle-cap-light to-bottle-cap-dark rounded-t-xl mb-1 shadow-md z-20" />
                {/* Neck */}
                <div className="w-7 xl:w-8 h-4 bg-accent/80 mb-1 z-20" />
                {/* Bottle Body */}
                <div className="w-full flex-1 bg-gradient-to-b from-bottle-brand-start to-bottle-brand-end rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                  {/* Glass Reflection */}
                  <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  {/* Label */}
                  <div className="w-24 h-24 bg-surface/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-accent/20">
                    <span className="text-brand font-black text-2xl">طيف</span>
                    <div className="w-6 h-[1px] bg-accent my-2" />
                    <span className="text-foreground text-[8px] tracking-[0.2em] uppercase text-center leading-tight">EAU DE PARFUM</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Typography */}
              <span className="absolute top-1/4 -right-10 text-[12rem] font-serif text-surface/5 rotate-90 select-none pointer-events-none">
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
          <h1 className="flex flex-col gap-2 mb-4">
            <span className="text-5xl sm:text-6xl font-black text-foreground leading-none tracking-tight">
              {data.heroTitle || "طيف"}
            </span>
            <span className="text-2xl sm:text-3xl font-light text-brand leading-tight mt-1">
              {data.heroSubtitle || "حضور لا يُنسى."}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 font-light leading-relaxed whitespace-pre-line">
            {data.heroDescription || "اكتشف مجموعتنا الحصرية من العطور الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً."}
          </p>
        </motion.div>

        {/* Bottle */}
        <div className="flex flex-col items-center flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] h-[300px] sm:h-[380px] flex-shrink-0"
          >
            <div className="absolute inset-x-3 top-3 bottom-0 border border-accent/25 rounded-t-full pointer-events-none" />
            <div className="absolute inset-0 bg-brand rounded-t-full overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-[130px] sm:w-[150px] h-[190px] sm:h-[220px] flex flex-col items-center z-10"
              >
                <div className="w-12 sm:w-14 h-10 sm:h-12 bg-gradient-to-b from-accent via-bottle-cap-light to-bottle-cap-dark rounded-t-xl mb-1 shadow-md z-20" />
                <div className="w-6 sm:w-8 h-3 sm:h-4 bg-accent/80 mb-1 z-20" />
                <div className="w-full flex-1 bg-gradient-to-b from-bottle-brand-start to-bottle-brand-end rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 left-[-50%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                  <div className="w-20 sm:w-24 h-20 sm:h-24 bg-surface/95 rounded-sm flex flex-col items-center justify-center p-2 shadow-inner border border-accent/20">
                    <span className="text-brand font-black text-xl sm:text-2xl">طيف</span>
                    <div className="w-6 h-[1px] bg-accent my-1 sm:my-2" />
                    <span className="text-foreground text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-center leading-tight">EAU DE PARFUM</span>
                  </div>
                </div>
              </motion.div>
              <span className="absolute top-1/4 -right-10 text-[8rem] sm:text-[10rem] font-serif text-surface/5 rotate-90 select-none pointer-events-none">TIF</span>
            </div>
          </motion.div>

          {/* Mobile Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row justify-between gap-3 w-full max-w-[280px] sm:max-w-[320px] mt-4"
          >
            <button
              onClick={scrollToProducts}
              className="flex-1 py-4 bg-brand text-surface font-bold text-[13px] sm:text-sm rounded-sm hover:bg-foreground transition-all shadow-[0_8px_25px_-8px_color-mix(in_srgb,var(--color-brand)_40%,transparent)] active:scale-95"
            >
              {data.heroPrimaryButton || "اكتشف المجموعة"}
            </button>
            <button className="flex-1 py-4 border border-brand/20 bg-transparent text-brand font-bold text-[13px] sm:text-sm rounded-sm hover:bg-brand/5 hover:border-brand/40 transition-all active:scale-95">
              {data.heroSecondaryButton || "قصة طيف"}
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
