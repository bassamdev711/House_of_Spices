'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { updateContactSettings } from './actions'
import { useToast } from '@/components/ToastProvider'

interface ContactSettingsData {
  phoneNumber?: string | null
  whatsappNumber?: string | null
  emailAddress?: string | null
  address?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
}

export default function ContactSettingsClient({ initialData }: { initialData: ContactSettingsData | null }) {
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ContactSettingsData>(initialData || {
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    address: '',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        phoneNumber: formData.phoneNumber || null,
        whatsappNumber: formData.whatsappNumber || null,
        emailAddress: formData.emailAddress || null,
        address: formData.address || null,
        instagramUrl: formData.instagramUrl || null,
        facebookUrl: formData.facebookUrl || null,
        twitterUrl: formData.twitterUrl || null,
      }
      
      const result = await updateContactSettings(dataToSave)
      if (result.success) {
        showToast('success', 'تم حفظ إعدادات التواصل بنجاح')
      } else {
        showToast('error', result.error || 'فشل في حفظ الإعدادات')
      }
    } catch (error) {
      showToast('error', 'حدث خطأ غير متوقع')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-sm shadow-sm border border-black/5">
        <div>
          <h1 className="text-2xl font-black text-deep-green mb-1">إعدادات التواصل</h1>
          <p className="text-sm text-deep-green/60">إدارة معلومات التواصل الخاصة بالمتجر وروابط التواصل الاجتماعي</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald text-white px-6 py-3 flex items-center gap-2 rounded-sm hover:bg-deep-green transition-colors disabled:opacity-50 font-bold shadow-md"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-black/5 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
            <div className="w-10 h-10 bg-emerald/10 text-emerald flex items-center justify-center rounded-full">
              <Phone size={20} />
            </div>
            <h2 className="text-xl font-bold text-deep-green">معلومات الاتصال</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-deep-green mb-2">رقم الهاتف العام</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                placeholder="مثال: +967 777 777 777"
                dir="ltr"
                className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-right"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-deep-green mb-2">رقم الواتساب</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleChange}
                placeholder="مثال: +967 777 777 777"
                dir="ltr"
                className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-right"
              />
              <p className="text-xs text-deep-green/50 mt-1">يُفضل كتابته مع رمز الدولة ليتمكن العملاء من النقر عليه</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-deep-green mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress || ''}
                  onChange={handleChange}
                  placeholder="info@tif-perfumes.com"
                  dir="ltr"
                  className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green pl-10 pr-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-right"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-green/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-deep-green mb-2">العنوان / المقر الرئيسي</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="مثال: صنعاء، الجمهورية اليمنية"
                  className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green pr-10 pl-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-green/40" size={18} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-black/5 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
            <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-full">
              <Instagram size={20} />
            </div>
            <h2 className="text-xl font-bold text-deep-green">التواصل الاجتماعي</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-deep-green mb-2 flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" /> رابط إنستغرام
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                dir="ltr"
                className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-left"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-deep-green mb-2 flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" /> رابط فيسبوك
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                dir="ltr"
                className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-left"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-deep-green mb-2 flex items-center gap-2">
                <Twitter size={16} className="text-sky-500" /> رابط تويتر (X)
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                dir="ltr"
                className="w-full bg-[#F9F7F2] border border-black/5 text-deep-green px-4 py-3 focus:outline-none focus:border-emerald/30 transition-colors text-left"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
