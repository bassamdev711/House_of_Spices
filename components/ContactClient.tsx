"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactClient({ contactData }: { contactData?: any }) {
  const phone = contactData?.phoneNumber || '+967 777 777 777'
  const showPhone = contactData?.showPhoneNumber !== false
  const email = contactData?.emailAddress || 'info@tif-perfumes.com'
  const showEmail = contactData?.showEmailAddress !== false
  const address = contactData?.address || 'صنعاء، الجمهورية اليمنية'
  const showAddress = contactData?.showAddress !== false

  return (
    <section id="contact" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12" dir="rtl">
        <div className="text-center mb-20">
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
            دائماً في خدمتك
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-green mb-6">تواصل معنا</h2>
          <div className="w-16 h-[2px] bg-emerald mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-3xl font-black text-deep-green mb-4">يسعدنا الاستماع إليك</h3>
              <p className="text-deep-green/70 font-light leading-relaxed">
                سواء كان لديك استفسار عن عطورنا، أو تود طلب توصية خاصة، أو لديك أي سؤال آخر، فإن فريق خدمة عملاء طيف مستعد دائماً لتقديم المساعدة التي تليق بك.
              </p>
            </div>

            <div className="space-y-8">
              {showPhone && (
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-emerald/5 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-ivory transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-deep-green font-bold mb-2">رقم الهاتف / واتساب</h4>
                    <p className="text-deep-green/60 font-light" dir="ltr">{phone}</p>
                  </div>
                </div>
              )}

              {showEmail && (
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-emerald/5 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-ivory transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-deep-green font-bold mb-2">البريد الإلكتروني</h4>
                    <p className="text-deep-green/60 font-light">{email}</p>
                  </div>
                </div>
              )}

              {showAddress && (
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-emerald/5 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-ivory transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-deep-green font-bold mb-2">المقر الرئيسي</h4>
                    <p className="text-deep-green/60 font-light">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 shadow-sm border border-black/5"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-deep-green text-sm font-bold mb-2">الاسم الكريم</label>
                  <input
                    type="text"
                    className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-deep-green text-sm font-bold mb-2">رقم الهاتف</label>
                  <input
                    type="text"
                    className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-deep-green text-sm font-bold mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-deep-green text-sm font-bold mb-2">رسالتك</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald text-ivory font-bold py-4 hover:bg-deep-green transition-colors"
              >
                إرسال الرسالة
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
