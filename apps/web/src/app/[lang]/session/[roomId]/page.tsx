'use client';

import { SessionAccessGuard } from '@/components/session/SessionAccessGuard';

interface PageProps {
  params: { lang: string; roomId: string };
}

export default function SessionRoute({ params }: PageProps) {
  return <SessionAccessGuard roomId={params.roomId} lang={params.lang} />;
}
