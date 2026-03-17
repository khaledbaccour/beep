import { getDictionary, type Locale } from '@/i18n';
import { ChoosePathPage } from '@/components/auth/ChoosePathPage';

interface PageProps {
  params: { lang: Locale };
}

export default async function ChoosePath({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  return <ChoosePathPage dict={dict} lang={params.lang} />;
}
