import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'hi'];
const defaultLocale = 'en';

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  if (locales.includes(maybeLocale)) return maybeLocale;
  return null;
}

// The legacy Tunisian domain (beep.tn) serves an "under construction" page;
// the live product runs on kliik.click. We detect the host here and forward a
// request header that the [lang] layout reads to swap in the placeholder.
function isTunisianHost(request: NextRequest): boolean {
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0];
  return host === 'beep.tn' || host.endsWith('.beep.tn');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Forward a site-mode header for the Tunisian placeholder.
  const requestHeaders = new Headers(request.headers);
  if (isTunisianHost(request)) {
    requestHeaders.set('x-site-mode', 'construction');
  }

  const pathnameLocale = getLocaleFromPath(pathname);

  // If no locale in path, treat as default locale (en) — rewrite internally
  if (!pathnameLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
};
