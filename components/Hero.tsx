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
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden bg-surface flex items-center"
    >
      {/* Ambient Luxury Lighting */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-brand/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[130px] pointer-events-none" />

      {/* Subtle Decorative Lines */}
      <div className="absolute inset-8 sm:inset-12 lg:inset-16 border border-accent/10 rounded-[2rem] pointer-events-none" />

      {/* Spice Atmosphere */}
      <FloatingSpices />

      <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16">
        <div
          dir="rtl"
          className="min-h-[calc(100dvh-8rem)] flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Small Brand Label */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-10 h-px bg-accent" />

                <span className="text-accent text-sm sm:text-base tracking-[0.25em] font-medium">
                  بهارات مختارة بعناية
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.25,
                  ease: "easeOut",
                }}
                className="
                  text-[3.2rem]
                  sm:text-[4.5rem]
                  md:text-[5.5rem]
                  lg:text-[6.5rem]
                  font-black
                  text-foreground
                  leading-[0.95]
                  tracking-[-0.04em]
                  mb-5
                "
              >
                {data.heroTitle || "بيت البهارات"}
              </motion.h1>

              {/* Gold Accent */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 90, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="h-[2px] bg-accent mb-6"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.65 }}
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-light
                  text-brand
                  leading-tight
                  mb-5
                "
              >
                {data.heroSubtitle || "مذاقٌ لا يُنسى."}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="
                  text-base
                  sm:text-lg
                  md:text-xl
                  text-foreground/65
                  font-light
                  leading-[1.9]
                  max-w-xl
                  mb-9
                  whitespace-pre-line
                "
              >
                {data.heroDescription ||
                  "اكتشف مجموعتنا الحصرية من البهارات الفاخرة،\nالمختارة بعناية لتمنح أطباقك عمقًا ورائحةً ومذاقًا استثنائيًا."}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button
                  onClick={scrollToProducts}
                  className="
                    btn
                    btn-primary
                    btn-lg
                    min-w-[210px]
                    rounded-full
                    text-lg
                    shadow-xl
                    shadow-brand/20
                    hover:shadow-brand/40
                    hover:-translate-y-0.5
                    transition-all
                    duration-300
                  "
                >
                  {data.heroPrimaryButton || "اكتشف المجموعة"}
                </button>

                <button
                  className="
                    btn
                    btn-outline
                    btn-lg
                    min-w-[210px]
                    rounded-full
                    text-lg
                    bg-surface/40
                    backdrop-blur-md
                    border
                    border-accent/30
                    hover:border-accent
                    hover:bg-accent/5
                    transition-all
                    duration-300
                  "
                >
                  {data.heroSecondaryButton || "قصة بيت البهارات"}
                </button>
              </motion.div>

              {/* Trust Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.25 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 text-xs sm:text-sm text-foreground/45"
              >
                <span>اختيار فاخر</span>

                <span className="w-1 h-1 rounded-full bg-accent/60" />

                <span>جودة مختارة</span>

                <span className="w-1 h-1 rounded-full bg-accent/60" />

                <span>نكهة أصيلة</span>
              </motion.div>
            </motion.div>

            {/* Spice Visual Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
              className="lg:col-span-5 relative min-h-[360px] sm:min-h-[450px] lg:min-h-[580px] flex items-center justify-center"
            >
              {/* Main Decorative Circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  w-[280px]
                  h-[280px]
                  sm:w-[380px]
                  sm:h-[380px]
                  lg:w-[470px]
                  lg:h-[470px]
                  rounded-full
                  border
                  border-accent/20
                "
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 100,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  w-[220px]
                  h-[220px]
                  sm:w-[300px]
                  sm:h-[300px]
                  lg:w-[390px]
                  lg:h-[390px]
                  rounded-full
                  border border-brand/15
                "
              />

              {/* Central Spice Composition */}
              <div className="relative z-10 flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    relative
                    w-48
                    h-48
                    sm:w-64
                    sm:h-64
                    lg:w-80
                    lg:h-80
                    rounded-full
                    bg-brand
                    shadow-2xl
                    shadow-brand/30
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                  "
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-black/20" />

                  {/* Spice-inspired rings */}
                  <div className="absolute inset-6 rounded-full border border-accent/30" />
                  <div className="absolute inset-10 rounded-full border border-accent/15" />

                  <div className="relative text-center px-6">
                    <div className="text-accent text-xs tracking-[0.3em] mb-3">
                      PREMIUM SPICES
                    </div>

                    <div className="text-surface text-3xl sm:text-4xl lg:text-5xl font-black">
                      {data.heroTitle || "بيت البهارات"}
                    </div>

                    <div className="mt-4 mx-auto w-12 h-px bg-accent/70" />

                    <div className="text-surface/70 text-xs mt-4">
                      مذاق أصيل · جودة استثنائية
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Spice Dots */}
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-[18%] right-[4%] w-12 h-12 rounded-full bg-accent/80 blur-[1px]"
              />

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute bottom-[16%] left-[4%] w-8 h-8 rounded-full bg-brand/70"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          hidden
          sm:flex
          flex-col
          items-center
          gap-2
          text-foreground/35
        "
      >
        <span className="text-[10px] tracking-[0.25em]">
          EXPLORE
        </span>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-8 bg-accent/40"
        />
      </motion.div>
    </section>
  );
}
