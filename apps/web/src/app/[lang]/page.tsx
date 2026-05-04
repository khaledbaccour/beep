import { getDictionary, type Locale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturedExpertsSection } from '@/components/landing/FeaturedExpertsSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/layout/Footer';

interface PageProps {
  params: { lang: Locale };
}

export default async function HomePage({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;

  return (
    <main className="relative overflow-hidden">
      <Navbar dict={dict} lang={lang} />
      <HeroSection dict={dict} lang={lang} />
      <CategoriesSection dict={dict} lang={lang} />
      <FeaturedExpertsSection dict={dict} lang={lang} />
      <HowItWorksSection dict={dict} lang={lang} />
      <StatsSection dict={dict} lang={lang} />
      <TestimonialsSection dict={dict} lang={lang} />
      <CTASection dict={dict} lang={lang} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
