import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Notes from "@/components/Notes";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="min-h-screen bg-crystal-blue text-frost-white overflow-hidden font-sans">
      <Preloader />
      <Navbar />
      <Hero />
      <Products />
      <Experience />
      <About />
      <Notes />
      <Stats />
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
}
