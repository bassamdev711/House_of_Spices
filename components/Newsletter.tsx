"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="relative py-32 bg-[#07111f] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-light-beam/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="glass-panel crystal-border p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Decorative light beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-1 bg-gradient-to-r from-transparent via-light-beam to-transparent opacity-50"></div>
          
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">النادي الحصري لطيف</h2>
          <p className="text-crystal-silver font-light mb-10 max-w-2xl mx-auto text-lg">
            كن أول من يعلم عن إصداراتنا المحدودة، القطع النادرة، والفعاليات الخاصة.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="البريد الإلكتروني..."
              className="flex-1 bg-white/5 border border-white/10 rounded-none px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-light-beam transition-colors"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-light-beam text-midnight-blue font-medium tracking-wider rounded-none hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(93,174,255,0.3)] hover:shadow-[0_0_25px_rgba(93,174,255,0.6)]"
            >
              اشتراك
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
