"use client";

import { motion } from "framer-motion";

export default function Stats({ data = {} }: { data?: any }) {
  const stats = data?.statsJson ? JSON.parse(data.statsJson) : [
    { value: "10K+", label: "عميل يثق بنا", delay: 0.1 },
    { value: "50+", label: "مكون عطري نادر", delay: 0.2 },
    { value: "100%", label: "زيوت عطرية نقية", delay: 0.3 },
    { value: "24h", label: "ثبات العطر", delay: 0.4 },
  ];

  return (
    <section className="py-20 bg-brand text-surface border-y border-accent/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-x-reverse divide-surface/10">
          {stats.map((stat: {value: string, label: string}, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (index * 0.1) + 0.1 }}
              className="text-center px-4"
            >
              <h4 className="text-4xl md:text-5xl font-black text-accent mb-3">{stat.value}</h4>
              <p className="text-sm md:text-base text-surface/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
