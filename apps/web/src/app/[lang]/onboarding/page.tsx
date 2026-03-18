import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

interface PageProps {
  params: { lang: Locale };
}

export default async function OnboardingPage({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  return (
    <main className="relative">
      <Navbar dict={dict} lang={params.lang} />
      <OnboardingWizard lang={params.lang} dict={dict} />
    </main>
  );
}
