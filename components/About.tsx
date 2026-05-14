"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#050b14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative min-h-[600px] md:aspect-video w-full overflow-hidden border border-white/10 group shadow-2xl">
          {/* Background with Parallax-like scale */}
          <div className="absolute inset-0 bg-[url('/imeg/photo_4_2026-05-13_05-39-00.jpg')] bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-[30s] ease-out"></div>
          
          {/* Luxury Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
          
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-20 text-center z-10" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="max-w-4xl"
            >
              <span className="text-light-beam text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-6 block">فلسفة طيف</span>
              
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                من نحن
              </h2>
              
              <div className="w-16 h-[2px] bg-light-beam mx-auto mb-10 opacity-50"></div>
              
              <p className="text-xl md:text-4xl text-white font-medium leading-tight mb-8">
                "في تقاطع الضوء والزجاج، وُلدت طيف. لتكون أكثر من مجرد علامة تجارية، بل حالة من التسامي والندرة."
              </p>
              
              <p className="text-crystal-silver/80 font-bold text-sm md:text-xl max-w-2xl mx-auto leading-relaxed md:leading-loose">
                حرفية استثنائية، إلهام سماوي، وتكريس للزجاج الكريستالي كمحفظة لأغلى السوائل. نحن نعيد تعريف الفخامة العربية بلمسة خيال علمي وحداثة مفرطة.
              </p>
            </motion.div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />
        </div>
      </div>
    </section>
  );
}
