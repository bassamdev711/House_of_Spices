"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Increased slightly for a smoother experience

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[999] bg-[#050b14] flex items-center justify-center overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute w-[500px] h-[500px] bg-light-beam/5 rounded-full blur-[120px]" />

          <div className="relative flex flex-col items-center">
            {/* The Rotating Crystal Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-32 h-32 md:w-48 md:h-48 border-t-2 border-l-2 border-white/10 rounded-full"
            >
              <div className="w-full h-full border-r-2 border-b-2 border-light-beam/20 rounded-full blur-[1px]" />
            </motion.div>

            {/* Centered Brand Name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter"
              >
                طيف
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-[10px] md:text-xs text-light-beam uppercase tracking-[0.5em] mt-2 font-bold"
              >
                Luxury Experience
              </motion.span>
            </div>

            {/* Bottom Loading Bar - Minimalist */}
            <div className="absolute -bottom-20 w-32 md:w-48 h-[1px] bg-white/5 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-light-beam to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
