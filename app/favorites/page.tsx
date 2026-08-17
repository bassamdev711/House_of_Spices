import FavoritesClient from "./FavoritesClient";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'المفضلة | بيت البهارات',
  description: 'منتجاتك المفضلة من توابل بيت البهارات',
};

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-surface text-foreground font-sans">
      <Navbar />
      <FavoritesClient />
      <Footer />
    </main>
  )
}
