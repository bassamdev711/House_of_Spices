"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function FloatingSpices() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movement for the parallax effect
  const springConfig = { damping: 50, stiffness: 400 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Define spice elements with specific SVG paths and parallax depths
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
      size: "w-20 h-20 md:w-28 md:h-28",
      position: { top: "15%", left: "5%" },
      color: "text-[#8B5A2B]/80", 
      depth: 40,
      duration: 6,
      rotate: [15, 45, 15],
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
      size: "w-24 h-24 md:w-36 md:h-36",
      position: { bottom: "15%", right: "10%" },
      color: "text-[#A0522D]/90", 
      depth: -60,
      duration: 8,
      rotate: [-20, 10, -20],
    },
    {
      id: "leaf",
      // Bay Leaf
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-2xl">
          <path d="M12 2C12 2 19 6 19 14C19 20 12 22 12 22C12 22 5 20 5 14C5 6 12 2 12 2Z" />
          <path d="M12 2L12 22" stroke="#2D3B11" strokeWidth="1" />
        </svg>
      ),
      size: "w-16 h-16 md:w-20 md:h-20",
      position: { top: "35%", right: "20%" },
      color: "text-[#556B2F]/70",
      depth: 25,
      duration: 5,
      rotate: [0, -30, 0],
    },
    {
      id: "saffron1",
      // Saffron thread 1
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-xl">
          <path d="M12 2C13 8 16 12 16 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ),
      size: "w-12 h-12 md:w-16 md:h-16",
      position: { top: "60%", left: "15%" },
      color: "text-[#D9381E]/90",
      depth: -30,
      duration: 4,
      rotate: [-10, 20, -10],
    },
    {
      id: "saffron2",
      // Saffron thread 2
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-xl">
          <path d="M12 2C11 8 8 12 8 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ),
      size: "w-14 h-14 md:w-20 md:h-20",
      position: { bottom: "35%", left: "35%" },
      color: "text-[#FF8C00]/80", 
      depth: 50,
      duration: 7,
      rotate: [45, 90, 45],
    },
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {spices.map((spice) => {
        // Create transform values for this specific spice based on its depth
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const x = useTransform(smoothMouseX, [-1, 1], [-spice.depth, spice.depth]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(smoothMouseY, [-1, 1], [-spice.depth, spice.depth]);

        return (
          <motion.div
            key={spice.id}
            className={`absolute ${spice.size} ${spice.color}`}
            style={{
              ...spice.position,
              x,
              y,
            }}
            // Autonomous floating and rotating animation
            animate={{
              y: [0, -25, 0], // Floating up and down
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
        );
      })}
    </div>
  );
}
