// components/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'kiro';
  action?: { type: 'order'; product: string } | { type: 'support' } | null;
};

export default function ChatWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'أهلاً بك، أنا كيرو مساعدك الشخصي في عالم العطور. كيف يمكنني خدمتك اليوم؟', sender: 'kiro', action: null }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التحكم بظهور المساعد بعد 3 ثوانٍ من فتح الموقع
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
      setShowTooltip(true);

      // إخفاء فقاعة الترحيب بعد 5 ثوانٍ من ظهورها
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(tooltipTimer);
    }, 3000);

    return () => clearTimeout(entranceTimer);
  }, []);

  // تدوير الغمزة (Wink) للعين اليسرى لإبقاء المساعد حياً وتفاعلياً
  useEffect(() => {
    if (!isVisible) return;
    const winkInterval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 300); // مدة الغمزة 300ms
    }, 4500); // تغمز العين كل 4.5 ثوانٍ

    return () => clearInterval(winkInterval);
  }, [isVisible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user', action: null }]);
    setLoading(true);

    // جلب آخر 10 رسائل من سجل المحادثة كحد أقصى لضمان كفاءة الطلب وسرعته
    const historyPayload = messages
      .slice(-10)
      .map(m => ({ sender: m.sender, text: m.text }));

    try {
      const res = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: historyPayload
        })
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        text: data.reply,
        sender: 'kiro',
        action: data.action
      }]);
    } catch {
      setMessages(prev => [...prev, {
        text: 'عذراً، واجهت مشكلة في الاتصال. يرجى المحاولة مرة أخرى.',
        sender: 'kiro',
        action: null
      }]);
    }
    setLoading(false);
  };

  const handleAction = (action: any) => {
    const phoneNumber = '967780500363';
    if (action?.type === 'order') {
      const text = encodeURIComponent(`مرحباً كيرو، أريد طلب: ${action.product}`);
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    } else if (action?.type === 'support') {
      const text = encodeURIComponent(`مرحباً، أحتاج للتحدث مع الدعم الفني.`);
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* أنماط الحركات المخصصة والمحسنة للأداء */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glowBreath {
          0%, 100% { 
            box-shadow: 0 10px 25px rgba(93, 174, 255, 0.4), inset 0 0 15px rgba(93, 174, 255, 0.2); 
            border-color: rgba(93, 174, 255, 0.7);
          }
          50% { 
            box-shadow: 0 10px 35px rgba(93, 174, 255, 0.65), inset 0 0 25px rgba(93, 174, 255, 0.4); 
            border-color: rgba(146, 205, 255, 0.9);
          }
        }
        @keyframes slideIn {
          0% { transform: scale(0) translateY(80px); opacity: 0; }
          70% { transform: scale(1.1) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes tooltipFade {
          0% { opacity: 0; transform: translateY(12px) scale(0.95); }
          15%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.95); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-glow-breath {
          animation: glowBreath 3s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-tooltip {
          animation: tooltipFade 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* فقاعة الترحيب الراقية */}
      {showTooltip && !isOpen && (
        <div
          className="animate-tooltip"
          style={{
            position: 'fixed',
            bottom: '7.5rem',
            left: '2rem',
            background: 'rgba(7, 17, 31, 0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(93, 174, 255, 0.4)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            borderRadius: '16px 16px 16px 4px',
            padding: '0.8rem 1.2rem',
            zIndex: 1000,
            color: '#eaf6ff',
            fontSize: '0.85rem',
            fontFamily: 'sans-serif',
            direction: 'rtl',
            textAlign: 'right',
            pointerEvents: 'none',
            maxWidth: '280px',
            lineHeight: '1.4'
          }}
        >
          مرحباً بك في عالم طيف! أنا كيرو، كيف يمكنني مساعدتك اليوم؟
        </div>
      )}

      {/* زر المساعد العائم الفاخر (زجاجة العطر الحية) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'fixed', bottom: '2rem', left: '2rem',
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a1630 0%, #07111f 100%)',
            border: '2px solid rgba(93, 174, 255, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          className="animate-slide-in animate-float animate-glow-breath hover:scale-110 active:scale-95 group"
        >
          <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* غطاء زجاجة العطر الفاخر - يتحرك للأعلى عند التمرير بالماوس */}
              <rect
                x="26" y="8" width="12" height="6" rx="2.5"
                fill="url(#capGrad)" stroke="#5daeff" strokeWidth="1.5"
                style={{
                  transform: isHovered ? 'translateY(-3px)' : 'none',
                  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              />
              {/* رقبة الزجاجة */}
              <rect x="29" y="14" width="6" height="4" fill="#5daeff" opacity="0.8" />

              {/* جسم زجاجة العطر الكريستالية */}
              <rect
                x="16" y="18" width="32" height="38" rx="8"
                fill="url(#bottleGrad)" stroke="#5daeff" strokeWidth="2"
                style={{
                  filter: isHovered ? 'drop-shadow(0 0 6px rgba(93, 174, 255, 0.5))' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* انحناء انعكاس سائل العطر بالداخل */}
              <path d="M 18 42 Q 32 40 46 42" stroke="rgba(93, 174, 255, 0.3)" strokeWidth="1.5" fill="none" />

              {/* ملامح الروح الحية التفاعلية (كيرو) */}
              <g style={{ transform: isHovered ? 'scale(1.05) translateY(-0.5px)' : 'none', transformOrigin: 'center', transition: 'transform 0.3s ease' }}>
                {/* العين اليسرى (تغمز بانتظام أو تبتسم عند التمرير) */}
                <path
                  d={isWinking ? "M 23 30 L 29 30" : isHovered ? "M 23 29 Q 26 26 29 29" : "M 23 29 Q 26 27 29 29"}
                  stroke="#5daeff" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  style={{ transition: 'd 0.15s ease' }}
                />
                {/* العين اليمنى (تبتسم عند التمرير) */}
                <path
                  d={isHovered ? "M 35 29 Q 38 26 41 29" : "M 35 29 Q 38 27 41 29"}
                  stroke="#5daeff" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  style={{ transition: 'd 0.15s ease' }}
                />
                {/* الابتسامة اللطيفة (تتسع عند التمرير) */}
                <path
                  d={isHovered ? "M 28 35 Q 32 39.5 36 35" : "M 29 35.5 Q 32 37.5 35 35.5"}
                  stroke="#5daeff" strokeWidth="2" strokeLinecap="round" fill="none"
                  style={{ transition: 'd 0.2s ease' }}
                />
              </g>

              <defs>
                <linearGradient id="capGrad" x1="26" y1="8" x2="38" y2="14" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8cc3ff" />
                  <stop offset="100%" stopColor="#2c72b8" />
                </linearGradient>
                <linearGradient id="bottleGrad" x1="16" y1="18" x2="48" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(10, 22, 48, 0.88)" />
                  <stop offset="100%" stopColor="rgba(7, 17, 31, 0.96)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </button>
      )}

      {/* نافذة المحادثة الفاخرة ذات التأثير الزجاجي الأنيق */}
      {isOpen && (
        <div
          className="animate-fade-in-scale"
          style={{
            position: 'fixed', bottom: '2rem', left: '2rem',
            width: 'min(400px, 90vw)', height: 'min(600px, 80vh)',
            background: 'rgba(7, 17, 31, 0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: '24px',
            border: '1px solid rgba(93, 174, 255, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column',
            zIndex: 1001, overflow: 'hidden',
          }}
        >
          {/* رأس نافذة الدردشة */}
          <div style={{ padding: '1.2rem', background: 'rgba(93, 174, 255, 0.1)', borderBottom: '1px solid rgba(93, 174, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* الأيقونة المصغرة الفاخرة للعلامة التجارية في الرأس */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(93, 174, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1630 0%, #07111f 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="26" y="8" width="12" height="6" rx="2.5" fill="url(#capGradMini)" stroke="#5daeff" strokeWidth="1.5" />
                  <rect x="29" y="14" width="6" height="4" fill="#5daeff" opacity="0.8" />
                  <rect x="16" y="18" width="32" height="38" rx="8" fill="rgba(10, 22, 48, 0.85)" stroke="#5daeff" strokeWidth="2" />
                  <path d="M 23 29 Q 26 27 29 29" stroke="#5daeff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 35 29 Q 38 27 41 29" stroke="#5daeff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 29 35.5 Q 32 37.5 35 35.5" stroke="#5daeff" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <defs>
                    <linearGradient id="capGradMini" x1="26" y1="8" x2="38" y2="14" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8cc3ff" />
                      <stop offset="100%" stopColor="#2c72b8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 style={{ color: '#5daeff', fontSize: '0.9rem', fontWeight: 700, margin: 0, fontFamily: 'sans-serif' }}>مساعدك كيرو</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }}></div>
                  <span style={{ color: 'rgba(93, 174, 255, 0.6)', fontSize: '0.65rem' }}>متصل الآن</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#5daeff', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover:scale-110 active:scale-90">
              <X size={24} />
            </button>
          </div>

          {/* مساحة رسائل الدردشة */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '0.8rem 1.2rem',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? '#123a6b' : 'rgba(255,255,255,0.05)',
                  color: '#eaf6ff',
                  border: msg.sender === 'user' ? '1px solid rgba(93,174,255,0.3)' : '1px solid rgba(93, 174, 255, 0.2)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  textAlign: 'right'
                }}>
                  {msg.text}

                  {msg.sender === 'kiro' && msg.action && (
                    <button
                      onClick={() => handleAction(msg.action)}
                      style={{
                        marginTop: '0.8rem', width: '100%', padding: '0.6rem',
                        borderRadius: '12px', cursor: 'pointer',
                        background: msg.action.type === 'order' ? '#123a6b' : 'transparent',
                        color: msg.action.type === 'order' ? '#eaf6ff' : '#5daeff',
                        fontWeight: 700, fontSize: '0.75rem',
                        border: msg.action.type === 'order' ? '1px solid rgba(93,174,255,0.3)' : '1px solid #5daeff',
                        transition: 'all 0.3s ease'
                      }}
                      className="hover:bg-opacity-80 active:scale-98"
                    >
                      {msg.action.type === 'order' ? 'إتمام الطلب عبر واتساب' : 'تحدث مع الإدارة'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(93,174,255,0.2)', borderRadius: '12px', color: '#5daeff' }}>
                <span className="animate-pulse">جاري الكتابة...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* حقل الإدخال والإرسال */}
          <div style={{ padding: '1.2rem', borderTop: '1px solid rgba(93, 174, 255, 0.2)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اسأل كيرو عن عطورنا المميزه..."
                style={{
                  width: '100%', padding: '0.8rem 1rem 0.8rem 3rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(93, 174, 255, 0.3)',
                  borderRadius: '14px', color: '#eaf6ff', fontSize: '0.85rem', outline: 'none',
                  textAlign: 'right'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{ position: 'absolute', left: '0.6rem', background: 'transparent', border: 'none', color: '#5daeff', cursor: 'pointer', display: 'flex', transition: 'transform 0.2s' }}
                className="hover:scale-110 active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
