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

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section id="experience" className="relative py-32 bg-white overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block">
            The Philosophy of Light
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-green mb-6">تجربة طيف</h2>
          <div className="w-12 h-[2px] bg-emerald mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div style={{ y: y1 }} className="space-y-12">
            <div className="bg-ivory p-8 md:p-12 border-r-2 border-emerald shadow-sm">
              <h3 className="text-2xl text-deep-green mb-4 font-black">الضوء والبلور</h3>
              <p className="text-deep-green/70 leading-relaxed font-light text-lg">
                نحن لا نصنع عطوراً فحسب، بل نلتقط الضوء في زجاجات كريستالية. كل قطرة تعكس نقاء الروح وتضيء العتمة، لتخلق هالة من السحر حول من يرتديها.
              </p>
            </div>
            
            <div className="bg-ivory p-8 md:p-12 border-l-2 border-gold shadow-sm md:mr-12">
              <h3 className="text-2xl text-deep-green mb-4 font-black">الصفاء المطلق</h3>
              <p className="text-deep-green/70 leading-relaxed font-light text-lg">
                مكوناتنا مستخلصة من أندر زهور الأرض، ممتزجة مع نسمات الهواء الباردة وقطرات الندى، لتعطي إحساساً بالبرودة والانتعاش الفاخر.
              </p>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="relative h-[600px] w-full hidden md:block">
            <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4"></div>
            <div className="absolute inset-0 overflow-hidden shadow-2xl bg-ivory p-4">
              <div className="relative w-full h-full">
                <Image
                  src="/imeg/photo_3_2026-05-13_05-39-00.jpg"
                  alt="Experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-emerald/10 mix-blend-overlay"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
