import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactPageContent } from '@/components/contact/ContactPageContent';

interface PageProps {
  params: { lang: Locale };
}

export default async function ContactPage({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;

  return (
    <main className="relative overflow-hidden">
      <Navbar dict={dict} lang={lang} />
      <ContactPageContent dict={dict} lang={lang} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
