"use client";

import { motion } from "framer-motion";

const notes = [
  {
    title: "النكهة المبدئية",
    desc: "الانطباع الأول",
    ingredients: "الزعفران، الفلفل الوردي، الليمون المجفف",
    delay: 0.2,
  },
  {
    title: "قلب النكهة",
    desc: "جوهر البهارات",
    ingredients: "الهيل، القرفة، الكمون",
    delay: 0.4,
  },
  {
    title: "النكهة الأساسية",
    desc: "الأثر الخالد",
    ingredients: "الزنجبيل، الكركم، القرنفل",
    delay: 0.6,
  },
];

export default function Notes() {
  return (
    <section className="relative py-32 bg-surface-alt overflow-hidden border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10" dir="rtl">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-black text-foreground mb-4"
          >
            تناغم النكهات
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.3 }}
             className="text-accent font-bold tracking-widest text-sm uppercase"
          >
            مزيج من التوابل يأسر الحواس
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent -translate-y-1/2 z-0"></div>

          {notes.map((note, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: note.delay }}
              className="relative z-10 w-full md:w-1/3"
            >
              <div className="bg-surface rounded-full w-64 h-64 mx-auto flex flex-col items-center justify-center p-6 text-center border border-black/5 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-500 relative group">
                <div className="absolute inset-2 rounded-full border border-accent/10 group-hover:border-accent/30 transition-colors duration-500 scale-95 group-hover:scale-100"></div>
                <h3 className="text-2xl font-black text-foreground mb-2">{note.title}</h3>
                <span className="text-xs font-bold text-accent mb-4 tracking-[0.2em] uppercase">{note.desc}</span>
                <p className="text-sm font-medium text-foreground/60">{note.ingredients}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
