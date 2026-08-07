"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المجموعة", href: "/products" },
    { name: "من نحن", href: "/#about" },
    { name: "تجربة طيف", href: "/#experience" },
    { name: "تواصل معنا", href: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-[#07111f]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-light-beam/5"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-widest text-frost-white group-hover:text-light-beam transition-colors duration-300">
            TIF
          </span>
          <span className="text-xl font-light text-crystal-silver tracking-[0.2em] group-hover:text-white transition-colors duration-300">
            طيف
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm tracking-wide text-crystal-silver hover:text-white transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-light-beam transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 text-frost-white hover:text-light-beam transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        className="fixed inset-0 bg-[#0a1630]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center min-h-screen"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ y: 20, opacity: 0 }}
              animate={isMobileMenuOpen ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={link.href}
                className="text-2xl font-light tracking-wider text-crystal-silver hover:text-light-beam transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
