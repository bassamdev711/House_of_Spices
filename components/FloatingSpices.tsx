"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingSpices() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, []);

  // Define spice elements with specific SVG paths
  const spices = [
    {
      id: "anise",
      // Star Anise
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl">
          <path d="M12 2L13.5 8L19.5 6L16 11.5L21.5 15L15 15.5L16.5 21L12 17L7.5 21L9 15.5L2.5 15L8 11.5L4.5 6L10.5 8L12 2Z" />
          <circle cx="12" cy="12" r="2.5" fill="#2C1810" />
        </svg>
      ),
      size: "w-20 h-20 md:w-32 md:h-32",
      position: { top: "10%", left: "10%" },
      color: "text-[#8B5A2B]/80", 
      duration: 6,
      rotate: [15, 60, 15],
      yOffset: -30,
    },
    {
      id: "cinnamon",
      // Cinnamon Stick
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl">
          <rect x="9" y="2" width="6" height="20" rx="3" transform="rotate(25 12 12)" />
          <rect x="7" y="2" width="3" height="20" rx="1.5" fill="#5C3A21" transform="rotate(25 12 12)" />
        </svg>
      ),
      size: "w-24 h-24 md:w-40 md:h-40",
      position: { bottom: "15%", right: "8%" },
      color: "text-[#A0522D]/90", 
      duration: 8,
      rotate: [-20, 20, -20],
      yOffset: 40,
    },
    {
      id: "leaf1",
      // Bay Leaf
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl">
          <path d="M12 2C12 2 19 6 19 14C19 20 12 22 12 22C12 22 5 20 5 14C5 6 12 2 12 2Z" />
          <path d="M12 2L12 22" stroke="#2D3B11" strokeWidth="1" />
        </svg>
      ),
      size: "w-16 h-16 md:w-24 md:h-24",
      position: { top: "30%", right: "15%" },
      color: "text-[#556B2F]/70",
      duration: 5,
      rotate: [0, -40, 0],
      yOffset: -20,
    },
    {
      id: "leaf2",
      // Bay Leaf 2
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl opacity-60 blur-[2px]">
          <path d="M12 2C12 2 19 6 19 14C19 20 12 22 12 22C12 22 5 20 5 14C5 6 12 2 12 2Z" />
          <path d="M12 2L12 22" stroke="#2D3B11" strokeWidth="1" />
        </svg>
      ),
      size: "w-20 h-20 md:w-28 md:h-28",
      position: { bottom: "35%", left: "10%" },
      color: "text-[#6B8E23]/60",
      duration: 7,
      rotate: [20, 50, 20],
      yOffset: 25,
    },
    {
      id: "saffron1",
      // Saffron thread 1
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-xl">
          <path d="M12 2C13 8 16 12 16 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ),
      size: "w-12 h-12 md:w-20 md:h-20",
      position: { top: "50%", left: "25%" },
      color: "text-[#D9381E]/90",
      duration: 4,
      rotate: [-10, 30, -10],
      yOffset: -15,
    },
    {
      id: "saffron2",
      // Saffron thread 2
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-xl blur-[1px]">
          <path d="M12 2C11 8 8 12 8 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ),
      size: "w-14 h-14 md:w-24 md:h-24",
      position: { top: "20%", left: "40%" },
      color: "text-[#FF8C00]/80", 
      duration: 7,
      rotate: [45, 100, 45],
      yOffset: 20,
    },
    {
      id: "clove",
      // Clove
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl">
          <path d="M10 2L14 2L15 6L13 10L13 22L11 22L11 10L9 6L10 2Z" />
          <circle cx="12" cy="3" r="2" fill="#2C1810" />
        </svg>
      ),
      size: "w-12 h-12 md:w-20 md:h-20",
      position: { bottom: "25%", right: "30%" },
      color: "text-[#4A2E1B]/90",
      duration: 6.5,
      rotate: [0, 45, 0],
      yOffset: -25,
    }
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {spices.map((spice) => (
        <motion.div
          key={spice.id}
          className={`absolute ${spice.size} ${spice.color}`}
          style={spice.position}
          animate={{
            y: [0, spice.yOffset, 0],
            rotate: spice.rotate,
          }}
          transition={{
            duration: spice.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {spice.icon}
        </motion.div>
      ))}
    </div>
  );
}
