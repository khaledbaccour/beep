'use client';

import { SessionPage } from '@/components/session/SessionPage';

interface PageProps {
  params: { lang: string; roomId: string };
}

export default function SessionRoute({ params }: PageProps) {
  return <SessionPage roomId={params.roomId} lang={params.lang} />;
}
