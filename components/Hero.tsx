"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FloatingSpices from "./FloatingSpices";

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

      {/* Floating 3D Spice Elements */}
      <FloatingSpices />

      {/* ── DESKTOP LAYOUT (lg and above) ── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[100dvh] relative z-10" dir="rtl">

        {/* RIGHT: Text — vertically centered, with padding to clear navbar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col justify-center text-right px-12 xl:px-20 pt-20 pb-16 max-w-xl ml-auto"
        >
          <h1 className="text-[6.5rem] xl:text-[7.5rem] font-black text-foreground leading-[0.88] tracking-tight mb-4">
            {data.heroTitle || "بيت البهارات"}
          </h1>

          <p className="text-2xl xl:text-3xl font-light text-brand leading-snug tracking-wide mb-10">
            {data.heroSubtitle || "مذاقٌ لا يُنسى."}
          </p>

          <p className="text-sm xl:text-base text-foreground/60 font-light leading-loose max-w-sm mb-14 whitespace-pre-line">
            {data.heroDescription || "اكتشف مجموعتنا الحصرية من البهارات الفاخرة،\nالمصممة بعناية لتمنحك تجربة حسية تدوم طويلًا."}
          </p>

          <div className="flex flex-row gap-4 justify-start">
            <button
              onClick={scrollToProducts}
              className="btn btn-primary btn-lg"
            >
              {data.heroPrimaryButton || "اكتشف المجموعة"}
            </button>
            <button className="btn btn-outline btn-lg">
              {data.heroSecondaryButton || "قصة بيت البهارات"}
            </button>
          </div>
        </motion.div>

        {/* LEFT: Image */}
        <div className="relative flex items-center justify-center overflow-hidden pt-[104px] pb-6 px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[500px] aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-surface"
          >
            <Image 
              src="/hero-spices.jpg" 
              alt="Premium Spices" 
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (below lg) ── */}
      <div className="flex lg:hidden flex-col min-h-[100dvh] relative z-10 pt-20 sm:pt-24 pb-6 px-5" dir="rtl">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col text-center w-full max-w-md mx-auto mb-5"
        >
          <h1 className="flex flex-col gap-1 mb-3">
            <span className="text-[2.5rem] sm:text-5xl font-black text-foreground leading-none tracking-tight">
              {data.heroTitle || "بيت البهارات"}
            </span>
            <span className="text-xl sm:text-2xl font-light text-brand leading-tight mt-1">
              {data.heroSubtitle || "مذاق لا يُنسى."}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 font-light leading-relaxed whitespace-pre-line">
            {data.heroDescription || "اكتشف مجموعتنا الحصرية من البهارات الفاخرة، المصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً."}
          </p>
        </motion.div>

        {/* Image */}
        <div className="flex flex-col items-center flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-[280px] aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-surface flex-shrink-0"
          >
            <Image 
              src="/hero-spices.jpg" 
              alt="Premium Spices" 
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Mobile Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row justify-between gap-2.5 w-full max-w-[280px] mt-8"
          >
            <button
              onClick={scrollToProducts}
              className="btn btn-primary flex-1"
            >
              {data.heroPrimaryButton || "اكتشف المجموعة"}
            </button>
            <button className="btn btn-outline flex-1">
              {data.heroSecondaryButton || "قصتنا"}
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
