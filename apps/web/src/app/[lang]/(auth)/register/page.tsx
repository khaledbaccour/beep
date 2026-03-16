import { getDictionary, type Locale } from '@/i18n';
import { RegisterPage } from '@/components/auth/RegisterPage';

interface PageProps {
  params: { lang: Locale };
}

export default async function Register({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  return <RegisterPage dict={dict} lang={params.lang} />;
}
