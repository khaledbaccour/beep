import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarketplacePage } from '@/components/marketplace/MarketplacePage';

export default function Marketplace() {
  return (
    <main className="relative">
      <Navbar />
      <MarketplacePage />
      <Footer />
    </main>
  );
}
