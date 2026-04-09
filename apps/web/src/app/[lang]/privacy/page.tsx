import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrivacyPageContent } from '@/components/privacy/PrivacyPageContent';

interface PageProps {
  params: { lang: Locale };
}

export default async function PrivacyPage({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;

  return (
    <main className="relative overflow-hidden">
      <Navbar dict={dict} lang={lang} />
      <PrivacyPageContent dict={dict} lang={lang} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
