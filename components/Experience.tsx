"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0]);

  return (
    <section id="experience" className="relative py-32 bg-[#0a1630] overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/imeg/photo_6_2026-05-13_05-39-00.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111f] via-[#0a1630]/80 to-[#07111f]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" dir="rtl">
        <motion.div style={{ opacity }} className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6">تجربة طيف</h2>
          <p className="text-xl text-light-beam tracking-widest uppercase font-light">
            The Philosophy of Light
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }} className="space-y-8">
            <div className="glass-panel p-8 md:p-12 border-l-4 border-l-light-beam">
              <h3 className="text-2xl text-white mb-4 font-medium">الضوء والبلور</h3>
              <p className="text-crystal-silver/90 leading-relaxed font-light text-lg">
                نحن لا نصنع عطوراً فحسب، بل نلتقط الضوء في زجاجات كريستالية. كل قطرة تعكس نقاء الروح وتضيء العتمة، لتخلق هالة من السحر حول من يرتديها.
              </p>
            </div>
            
            <div className="glass-panel p-8 md:p-12 border-r-4 border-r-sapphire-glow md:mr-12">
              <h3 className="text-2xl text-white mb-4 font-medium">الصفاء المطلق</h3>
              <p className="text-crystal-silver/90 leading-relaxed font-light text-lg">
                مكوناتنا مستخلصة من أندر زهور الأرض، ممتزجة مع نسمات الهواء الباردة وقطرات الندى، لتعطي إحساساً بالبرودة والانتعاش الفاخر.
              </p>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="relative h-[600px] w-full hidden md:block">
            <div className="absolute inset-0 glass-panel crystal-border translate-x-4 translate-y-4"></div>
            <div className="absolute inset-0 overflow-hidden shadow-2xl">
              <Image
                src="/imeg/photo_3_2026-05-13_05-39-00.jpg"
                alt="Experience"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-midnight-blue/60 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
