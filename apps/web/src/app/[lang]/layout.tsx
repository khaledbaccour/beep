import { i18n, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import '../globals.css';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  if (!i18n.locales.includes(params.lang)) {
    notFound();
  }

  return (
    <html
      lang={params.lang}
      dir={params.lang === 'ar' ? 'rtl' : 'ltr'}
      className="scroll-smooth"
    >
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
