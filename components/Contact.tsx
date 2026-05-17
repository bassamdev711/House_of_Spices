"use client";

import { motion } from "framer-motion";
import { MessageCircle, Share2, Phone, Globe, Mail, MapPin, Clock } from "lucide-react";

// Official Social Icons as SVGs
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#0a1630] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">تواصل معنا</h2>
            <p className="text-crystal-silver font-light mb-12 text-lg">
              فريقنا متواجد لتقديم استشارات عطرية خاصة، وللإجابة على أي استفسار يخص مجموعاتنا الحصرية.
            </p>

            <div className="space-y-6">
              <a href="https://wa.me/967780500363" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#25D366] group-hover:bg-[#25D366]/10 transition-all duration-300">
                  <div className="text-white group-hover:text-[#25D366] transition-colors">
                    <WhatsAppIcon />
                  </div>
                </div>
                <span className="text-xl text-white font-light group-hover:text-light-beam transition-colors">واتساب: 780500363</span>
              </a>
              <a href="tel:780500363" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-light-beam transition-colors">
                  <Phone className="text-white group-hover:text-light-beam transition-colors" />
                </div>
                <span className="text-xl text-white font-light group-hover:text-light-beam transition-colors">اتصال: 780500363</span>
              </a>
              <a href="https://www.instagram.com/bo.ss1.1?igsh=c2xiN2VmeWV4cWFy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#E1306C] group-hover:bg-[#E1306C]/10 transition-all duration-300">
                  <div className="text-white group-hover:text-[#E1306C] transition-colors">
                    <InstagramIcon />
                  </div>
                </div>
                <span className="text-xl text-white font-light group-hover:text-light-beam transition-colors">انستغرام</span>
              </a>
              <a href="https://www.facebook.com/bsam.bdalhkym.alshmyry?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#1877F2] group-hover:bg-[#1877F2]/10 transition-all duration-300">
                  <div className="text-white group-hover:text-[#1877F2] transition-colors">
                    <FacebookIcon />
                  </div>
                </div>
                <span className="text-xl text-white font-light group-hover:text-light-beam transition-colors">فيسبوك</span>
              </a>
              <a href="mailto:boosalshamiri124354@gmail.com" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-light-beam transition-colors">
                  <Mail className="text-white group-hover:text-light-beam transition-colors" />
                </div>
                <span className="text-xl text-white font-light group-hover:text-light-beam transition-colors" style={{ wordBreak: 'break-all' }}>boosalshamiri124354@gmail.com</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-panel crystal-border p-8 md:p-12"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-light text-crystal-silver mb-2">الاسم الكريم</label>
                <input type="text" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-light-beam transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-light text-crystal-silver mb-2">البريد الإلكتروني</label>
                <input type="email" className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-light-beam transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-light text-crystal-silver mb-2">الرسالة</label>
                <textarea rows={4} className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-light-beam transition-colors resize-none"></textarea>
              </div>
              <button className="w-full py-4 bg-transparent border border-light-beam text-light-beam hover:bg-light-beam hover:text-midnight-blue transition-all duration-300 font-medium tracking-widest uppercase mt-4">
                إرسال
              </button>
            </form>
          </motion.div>
        </div>

        {/* Boutique Location Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 border border-white/10 bg-[#050b14]/60 backdrop-blur-md p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Map Info */}
            <div className="lg:col-span-1 text-right space-y-4">
              <span className="text-light-beam font-bold text-[10px] tracking-[0.3em] uppercase block">معرضنا الرئيسي</span>
              <h3 className="text-2xl md:text-3xl font-black text-white">معرض طيف - صنعاء</h3>
              <p className="text-crystal-silver/80 font-light text-sm leading-relaxed">
                يسعدنا استقبالكم في معرضنا الفاخر بصنعاء لتجربة عطرية حية وفريدة من نوعها، واستكشاف كامل المجموعة الحصرية الحية عن قرب بمساعدة خبراء العطور لدينا.
              </p>
              <div className="w-12 h-[1px] bg-light-beam/40 my-4" />
              <div className="text-xs text-white/75 space-y-4 font-light">
                <p className="flex items-center gap-3 justify-start">
                  <MapPin className="w-4 h-4 text-light-beam shrink-0" />
                  <span>الموقع: الجمهورية اليمنية، صنعاء - شارع حدة</span>
                </p>
                <p className="flex items-center gap-3 justify-start">
                  <Clock className="w-4 h-4 text-light-beam shrink-0" />
                  <span>أوقات العمل: يومياً من 10:00 صباحاً حتى 10:00 مساءً</span>
                </p>
                <p className="flex items-center gap-3 justify-start">
                  <Phone className="w-4 h-4 text-light-beam shrink-0" />
                  <span>هاتف المبيعات: 780500363</span>
                </p>
              </div>
            </div>
            
            {/* Styled Map Iframe Container */}
            <div className="lg:col-span-2 relative h-[300px] md:h-[350px] w-full border border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 pointer-events-none z-10 border border-white/5" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.3807212450837!2d44.204652!3d15.318538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603db0ac8885c3f%3A0xe543ef6ff79c8845!2sHadda%20St%2C%20Sana'a!5e0!3m2!1sen!2sye!4v1700000000000!5m2!1sen!2sye"
                width="100%"
                height="100%"
                style={{ 
                  border: 0, 
                  filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(45%)' 
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
