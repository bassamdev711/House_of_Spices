"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "أحمد عبدالله",
    role: "عاشق للعطور الفاخرة",
    text: "عطر طيف ليس مجرد رائحة، بل هو تجربة متكاملة تنقلك إلى عالم من الفخامة. الثبات استثنائي والفوحان لا يقاوم.",
  },
  {
    name: "سارة محمد",
    role: "سيدة أعمال",
    text: "منذ أول رشة أدركت أنني أمام عطر مميز. يعطيني ثقة كبيرة في اجتماعاتي ويترك أثراً في كل مكان أذهب إليه.",
  },
  {
    name: "خالد سعيد",
    role: "جامع عطور",
    text: "التغليف، الزجاجة، والرائحة... كل التفاصيل تصرخ بالفخامة. أمتلك العديد من العطور العالمية، ولكن طيف أصبح مفضلي الأول.",
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#F9F7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative" dir="rtl">
        <div className="text-center mb-20">
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
            آراء عملائنا
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-green mb-6">تجربة لا تُنسى</h2>
          <div className="w-16 h-[2px] bg-emerald mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-ivory p-8 md:p-10 shadow-sm border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="text-gold text-2xl mb-6">"</div>
                <p className="text-deep-green/80 font-light text-lg leading-relaxed mb-8">
                  {testimonial.text}
                </p>
              </div>
              <div className="border-t border-black/5 pt-6">
                <h4 className="text-deep-green font-bold mb-1">{testimonial.name}</h4>
                <p className="text-emerald text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
