export default function Footer() {
  const quickLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "المجموعة", href: "#products" },
    { name: "من نحن", href: "#about" },
    { name: "تجربة طيف", href: "#experience" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <footer className="bg-[#050b14] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-3xl font-bold tracking-widest text-frost-white">TIF</span>
              <span className="text-base font-light text-crystal-silver">طيف للعود والعطور الفاخرة</span>
            </div>
            <p className="text-sm text-crystal-silver/60 leading-relaxed text-center md:text-right max-w-xs">
              تجربة سينمائية فاخرة تدمج بين سحر العطر العربي والتقنية العالمية الحديثة.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h4 className="text-white font-medium text-lg relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-10 after:h-[1px] after:bg-light-beam">
              روابط سريعة
            </h4>
            <ul className="flex flex-col items-center md:items-start gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-crystal-silver/70 hover:text-light-beam transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h4 className="text-white font-medium text-lg relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-10 after:h-[1px] after:bg-light-beam">
              المقر الرئيسي
            </h4>
            <div className="flex flex-col items-center md:items-start gap-3 text-sm text-crystal-silver/70">
              <p>اليمن، حيث تبدأ قصة العطور</p>
              <p>خدمة العملاء: 780500363</p>
              <p>البريد: boosalshamiri124354@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-crystal-silver/40 text-xs font-light text-center md:text-right">
            &copy; {new Date().getFullYear()} TIF Perfumes. جميع الحقوق محفوظة.
          </div>
          
          <div className="text-crystal-silver/60 text-sm font-light flex flex-col md:flex-row items-center gap-2">
            <span>تصميم وتطوير</span>
            <span className="text-light-beam font-medium tracking-wide">المهندس بسام</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
