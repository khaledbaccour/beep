import { NextRequest, NextResponse } from 'next/server';

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  if (locales.includes(maybeLocale)) return maybeLocale;
  return null;
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

  const pathnameLocale = getLocaleFromPath(pathname);

  // If no locale in path, treat as default locale (fr) — rewrite internally
  if (!pathnameLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
};
