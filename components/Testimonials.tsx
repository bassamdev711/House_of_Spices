"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "سارة المانع",
    role: "عاشقة للعطور",
    text: "تجربة غير مسبوقة. زجاجة 'بلورة الليل' ليست مجرد عطر، بل هي قطعة فنية تضفي فخامة على المكان، ورائحتها تدوم بشكل مذهل.",
  },
  {
    id: 2,
    name: "خالد الراشد",
    role: "مقتني عطور نادرة",
    text: "لم أجد في حياتي دمجاً بهذا الرقي بين برودة الزجاج وعمق العود. 'وهج الياقوت' أخذني لعالم آخر تماماً.",
  },
  {
    id: 3,
    name: "نورة العبدالله",
    role: "مصممة أزياء",
    text: "الاهتمام بالتفاصيل من الزجاجة وحتى العبوة الخارجية شيء يفوق الوصف. رائحة 'طيف' أصبحت توقيعي الشخصي.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-[#0a1630] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" dir="rtl">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-light text-white mb-4"
          >
            آراء النخبة
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="glass-panel crystal-border p-8 relative group"
            >
              <Quote className="absolute top-6 right-6 text-light-beam/20 w-12 h-12 rotate-180 group-hover:text-light-beam/40 transition-colors duration-500" />
              <p className="text-crystal-silver/90 font-light leading-relaxed mb-8 relative z-10 text-lg">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-beam to-sapphire-glow p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#07111f] flex items-center justify-center">
                    <span className="text-white font-light">{t.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium">{t.name}</h4>
                  <span className="text-xs text-light-beam tracking-widest">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
