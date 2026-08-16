"use client";

import { motion } from "framer-motion";
import FloatingSpices from "./FloatingSpices";

export default function Hero({ data = {} }: { data?: any }) {
  const scrollToProducts = () => {
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-[100dvh] overflow-hidden bg-surface flex items-center justify-center">
      {/* Background Subtle Elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Floating 3D Spice Elements - Non-interactive, pure floating animation */}
      <FloatingSpices />

      {/* Content - Centered Layout */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] font-black text-foreground leading-[1] tracking-tighter mb-4 sm:mb-6">
              {data.heroTitle || "بيت البهارات"}
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-4xl font-light text-brand leading-snug tracking-wide mb-6 sm:mb-10"
          >
            {data.heroSubtitle || "مذاقٌ لا يُنسى."}
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-foreground/60 font-light leading-relaxed max-w-2xl mb-12 sm:mb-16 whitespace-pre-line"
          >
            {data.heroDescription || "اكتشف مجموعتنا الحصرية من البهارات الفاخرة،\nالمصممة بعناية فائقة لتمنحك تجربة حسية فريدة تدوم طويلاً."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center"
          >
            <button
              onClick={scrollToProducts}
              className="btn btn-primary btn-lg min-w-[200px] text-lg rounded-full shadow-xl shadow-brand/20 hover:shadow-brand/40 transition-all duration-300"
            >
              {data.heroPrimaryButton || "اكتشف المجموعة"}
            </button>
            <button className="btn btn-outline btn-lg min-w-[200px] text-lg rounded-full bg-surface/50 backdrop-blur-sm border-2 border-brand/20 hover:border-brand/60 transition-all duration-300">
              {data.heroSecondaryButton || "قصة بيت البهارات"}
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
