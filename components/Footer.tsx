import Link from "next/link";
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
              {[InstagramIcon, FacebookIcon, TwitterIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-emerald transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
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
              <li className="flex items-center gap-3">
                <span className="text-gold">📍</span>
                صنعاء، اليمن
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">📞</span>
                <span dir="ltr">+967 777 777 777</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✉️</span>
                info@tif-perfumes.com
              </li>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
