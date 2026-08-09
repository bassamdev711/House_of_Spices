"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

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
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-emerald/95 backdrop-blur-md py-2 shadow-md"
          : "bg-emerald py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-widest text-gold transition-colors duration-300">
            TIF
          </span>
          <span className="text-lg font-light text-ivory tracking-[0.2em] transition-colors duration-300">
            طيف
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-wide text-ivory/80 hover:text-gold transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-4 relative z-50">
          <button className="text-gold hover:text-ivory transition-colors" aria-label="البحث">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link href="/cart" className="text-gold hover:text-ivory transition-colors relative" aria-label="سلة المشتريات">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold text-emerald text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gold hover:text-ivory transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        className="fixed inset-0 bg-emerald/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center min-h-screen"
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
                className="text-xl font-medium tracking-wider text-ivory hover:text-gold transition-colors"
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
