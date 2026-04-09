import { i18n, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import { UnderConstructionPage } from '@/components/UnderConstructionPage';

const UNDER_CONSTRUCTION = true;
import {
  Space_Grotesk,
  DM_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google';
import '../globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const accent = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

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
      className={`scroll-smooth ${display.variable} ${body.variable} ${accent.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-white">
        {UNDER_CONSTRUCTION ? <UnderConstructionPage lang={params.lang} /> : children}
      </body>
    </html>
  );
}
