import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ExpertProfilePage } from '@/components/expert/ExpertProfilePage';

interface PageProps {
  params: { lang: Locale; slug: string };
}

export default async function ExpertPage({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;

  return (
    <main className="relative">
      <Navbar dict={dict} lang={lang} />
      <ExpertProfilePage slug={params.slug} dict={dict} lang={lang} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
