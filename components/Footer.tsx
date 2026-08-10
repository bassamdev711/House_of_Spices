import Link from "next/link";
import { Send, AtSign } from "lucide-react";
import prisma from "@/lib/prisma";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  const legalPages = await prisma.legalPage.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }
  });

  const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
  const contactSettings = await prisma.contactSettings.findUnique({ where: { id: 'singleton' } });

  const phone = contactSettings?.phoneNumber || '+967 777 777 777';
  const showPhone = contactSettings?.showPhoneNumber !== false;
  const email = contactSettings?.emailAddress || 'info@tif-perfumes.com';
  const showEmail = contactSettings?.showEmailAddress !== false;
  const address = contactSettings?.address || 'صنعاء، اليمن';
  const showAddress = contactSettings?.showAddress !== false;
  
  const instagram = contactSettings?.instagramUrl || '#';
  const showInstagram = contactSettings?.showInstagram !== false;
  const facebook = contactSettings?.facebookUrl || '#';
  const showFacebook = contactSettings?.showFacebook !== false;
  const twitter = contactSettings?.twitterUrl || '#';
  const showTwitter = contactSettings?.showTwitter !== false;
  const telegram = contactSettings?.telegramUrl || '#';
  const showTelegram = contactSettings?.showTelegram !== false;
  const threads = contactSettings?.threadsUrl || '#';
  const showThreads = contactSettings?.showThreads !== false;
  return (
    <footer className="bg-emerald border-t border-gold/10 text-ivory/80 pt-20 pb-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold tracking-widest text-gold">TIF</span>
              <span className="text-2xl font-light text-ivory ml-2 tracking-[0.2em]">طيف</span>
            </Link>
            <p className="text-sm leading-relaxed text-ivory/60 mb-6">
              نصنع العطور لتكون أكثر من مجرد رائحة، بل تجربة حسية تعكس هويتك وتترك أثراً لا يُنسى.
            </p>
            <div className="flex gap-4">
              {showInstagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {showFacebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {showTwitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <TwitterIcon size={18} />
                </a>
              )}
              {showTelegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <Send size={18} />
                </a>
              )}
              {showThreads && (
                <a
                  href={threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <AtSign size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-ivory font-bold mb-6 tracking-wider">استكشف</h4>
            <ul className="space-y-4">
              {['المجموعة الحصرية', 'العطور الرجالية', 'العطور النسائية', 'المجموعات الخاصة'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-ivory font-bold mb-6 tracking-wider">خدمة العملاء</h4>
            <ul className="space-y-4">
              {legalPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`} className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
              {settings?.showShippingInFooter && (
                <li>
                  <Link href="/policies/shipping" className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    سياسة الشحن والتوصيل
                  </Link>
                </li>
              )}
              {settings?.showReturnInFooter && (
                <li>
                  <Link href="/policies/return" className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    سياسة الاسترجاع
                  </Link>
                </li>
              )}
              <li>
                <Link href="#" className="text-sm text-ivory/60 hover:text-gold transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-ivory font-bold mb-6 tracking-wider">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-ivory/60">
              {showAddress && (
                <li className="flex items-center gap-3">
                  <span className="text-gold">📍</span>
                  {address}
                </li>
              )}
              {showPhone && (
                <li className="flex items-center gap-3">
                  <span className="text-gold">📞</span>
                  <span dir="ltr">{phone}</span>
                </li>
              )}
              {showEmail && (
                <li className="flex items-center gap-3">
                  <span className="text-gold">✉️</span>
                  {email}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory/40">
          <p>© {currentYear} TIF Perfumes. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            {legalPages.map(page => (
              <Link key={page.id} href={`/pages/${page.slug}`} className="hover:text-gold transition-colors">
                {page.title}
              </Link>
            ))}
            {settings?.showShippingInFooter && (
              <Link href="/policies/shipping" className="hover:text-gold transition-colors">
                سياسة الشحن
              </Link>
            )}
            {settings?.showReturnInFooter && (
              <Link href="/policies/return" className="hover:text-gold transition-colors">
                سياسة الاسترجاع
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
