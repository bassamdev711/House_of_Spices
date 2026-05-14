"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { buildWhatsAppMessage, WHATSAPP_NUMBER, OrderData } from '@/lib/whatsapp';

interface OrderButtonProps {
  product: Omit<OrderData, 'productUrl'>;
}

const OrderButton: React.FC<OrderButtonProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOrder = () => {
    setIsLoading(true);
    
    // محاكاة تحميل بسيطة لتعزيز تجربة المستخدم UX
    setTimeout(() => {
      const productUrl = window.location.href;
      const message = buildWhatsAppMessage({ ...product, productUrl });
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOrder}
      disabled={isLoading}
      className="relative group overflow-hidden px-12 py-5 bg-white text-black font-black text-lg rounded-none transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 w-full sm:w-auto"
    >
      {/* Animation effect on background */}
      <span className="absolute inset-0 w-0 bg-light-beam transition-all duration-500 ease-out group-hover:w-full"></span>
      
      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full"
          />
        ) : (
          <ShoppingCart className="w-5 h-5" />
        )}
        {isLoading ? 'جاري التحويل...' : 'اطلب عبر واتساب'}
      </span>
      
      {/* Glossy overlay effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
    </motion.button>
  );
};

export default OrderButton;
