import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ExpertProfilePage } from '@/components/expert/ExpertProfilePage';

interface ExpertPageProps {
  params: { slug: string };
}

export default function ExpertPage({ params }: ExpertPageProps) {
  return (
    <main className="relative">
      <Navbar />
      <ExpertProfilePage slug={params.slug} />
      <Footer />
    </main>
  );
}
