"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "عميل يثق بنا", delay: 0.1 },
  { value: "50+", label: "مكون عطري نادر", delay: 0.2 },
  { value: "100%", label: "زيوت عطرية نقية", delay: 0.3 },
  { value: "24h", label: "ثبات العطر", delay: 0.4 },
];

export default function Stats() {
  return (
    <section className="py-20 bg-emerald text-ivory border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-x-reverse divide-ivory/10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: stat.delay }}
              className="text-center px-4"
            >
              <h4 className="text-4xl md:text-5xl font-black text-gold mb-3">{stat.value}</h4>
              <p className="text-sm md:text-base text-ivory/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
