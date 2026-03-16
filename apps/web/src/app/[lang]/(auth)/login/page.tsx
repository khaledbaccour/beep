import { getDictionary, type Locale } from '@/i18n';
import { LoginPage } from '@/components/auth/LoginPage';

interface PageProps {
  params: { lang: Locale };
}

export default async function Login({ params }: PageProps) {
  const dict = await getDictionary(params.lang);
  return <LoginPage dict={dict} lang={params.lang} />;
}
