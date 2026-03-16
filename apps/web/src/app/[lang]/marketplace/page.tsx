import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { MarketplacePage } from '@/components/marketplace/MarketplacePage';
import { Footer } from '@/components/layout/Footer';

interface PageProps {
  params: { lang: Locale };
}

export default async function Marketplace({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;

  return (
    <main className="relative">
      <Navbar dict={dict} lang={lang} />
      <MarketplacePage dict={dict} lang={lang} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
