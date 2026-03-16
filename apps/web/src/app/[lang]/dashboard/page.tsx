import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DashboardPage } from '@/components/dashboard/DashboardPage';

interface PageProps {
  params: { lang: Locale };
}

export default async function Dashboard({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  return (
    <main className="relative">
      <Navbar dict={dict} lang={params.lang} />
      <DashboardPage dict={dict} lang={params.lang} />
      <Footer dict={dict} lang={params.lang} />
    </main>
  );
}
