"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Users, Droplets, Globe, Star } from "lucide-react";

const stats = [
  { id: 1, label: "عميل حول العالم", value: 15000, suffix: "+", icon: Users },
  { id: 2, label: "عطر فريد", value: 6, suffix: "", icon: Droplets },
  { id: 3, label: "دولة حول العالم", value: 45, suffix: "+", icon: Globe },
  { id: 4, label: "تقييم 5 نجوم", value: 10000, suffix: "+", icon: Star },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl md:text-5xl font-black text-white block mb-1">
      {count.toLocaleString()}
      <span className="text-light-beam ml-1">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-24 bg-[#050b14] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(93,174,255,0.05)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 md:p-10 bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-light-beam/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 p-3 bg-white/5 rounded-full text-light-beam group-hover:scale-110 transition-transform duration-500">
                  <stat.icon size={24} strokeWidth={1.5} />
                </div>
                
                <Counter value={stat.value} suffix={stat.suffix} />
                
                <p className="text-crystal-silver/60 font-bold text-[10px] md:text-xs uppercase tracking-widest text-center">
                  {stat.label}
                </p>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-light-beam/20 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
