"use client";

import { motion } from "framer-motion";

const notes = [
  {
    title: "النوتات العليا",
    desc: "برودة البداية",
    ingredients: "البرغموت، ندى الصباح، الأوزون",
    delay: 0.2,
  },
  {
    title: "نوتات القلب",
    desc: "روح الكريستال",
    ingredients: "الأوركيد الأزرق، زهرة اللوتس، السوسن",
    delay: 0.4,
  },
  {
    title: "النوتات الأساسية",
    desc: "العمق والغموض",
    ingredients: "العود البارد، المسك الأبيض، أخشاب الصندل",
    delay: 0.6,
  },
];

export default function Notes() {
  return (
    <section className="relative py-32 bg-[#0a1630] overflow-hidden">
      {/* Particles effect placeholder via CSS/background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" dir="rtl">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-light text-white mb-4"
          >
            الهرم العطري
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.3 }}
            className="text-light-beam font-light tracking-wider"
          >
            تدرج عطري يعكس الضوء
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-light-beam to-transparent -translate-y-1/2 opacity-30 z-0"></div>

          {notes.map((note, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: note.delay }}
              className="relative z-10 w-full md:w-1/3"
            >
              <div className="glass-panel rounded-full w-64 h-64 mx-auto flex flex-col items-center justify-center p-6 text-center crystal-border hover-glow relative group">
                <div className="absolute inset-2 rounded-full border border-white/5 group-hover:border-light-beam/30 transition-colors duration-500"></div>
                <h3 className="text-2xl font-medium text-white mb-2">{note.title}</h3>
                <span className="text-xs text-light-beam mb-4 tracking-widest">{note.desc}</span>
                <p className="text-sm font-light text-crystal-silver/90">{note.ingredients}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
