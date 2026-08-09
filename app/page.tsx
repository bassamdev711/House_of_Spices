import dynamic from 'next/dynamic'
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";

// Server Components can be directly imported if they are lightweight, 
// but we want to stream them or lazy load client components.
import CollectionsSection from "@/components/CollectionsSection";
import ProductsServer from "@/components/ProductsServer";

// Dynamic Imports for components below the fold (Lazy Loading)
const Experience = dynamic(() => import("@/components/Experience"), { ssr: true })
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true })
const Newsletter = dynamic(() => import("@/components/Newsletter"), { ssr: true })
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true })
const Stats = dynamic(() => import("@/components/Stats"), { ssr: true })

export default function Home() {
  return (
    <main className="min-h-screen bg-crystal-blue text-frost-white overflow-hidden font-sans">
      <Navbar />
      
      {/* 1. Store Identity */}
      <Hero />
      
      {/* 2. Value Proposition */}
      <About />
      
      {/* 3. Categories (Collections) */}
      <CollectionsSection />
      
      {/* 4. Bestsellers */}
      <ProductsServer 
        type="bestsellers" 
        title="الأكثر مبيعاً" 
        subtitle="اختيارات عملائنا المفضلة" 
      />
      
      {/* 5. Offers */}
      <ProductsServer 
        type="offers" 
        title="عروض حصرية" 
        subtitle="فرصتك لاقتناء الفخامة" 
      />
      
      {/* 6. Handpicked / Featured */}
      <ProductsServer 
        type="featured" 
        title="منتجات مختارة" 
        subtitle="ترشيحات خبراء طيف" 
      />
      
      {/* 7. Why trust us */}
      <Experience />
      
      {/* 8. Stats (Social Proof) */}
      <Stats />
      
      {/* 9. Testimonials */}
      <Testimonials />
      
      {/* 10. Call to action */}
      <Newsletter />
      <Contact />
      
      <Footer />
    </main>
  );
}
