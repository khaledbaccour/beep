import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'kliik - Book Expert Sessions Instantly',
  description: 'Connect with top experts in fitness, education, business, law, and more. Book 1-on-1 video sessions with verified professionals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
