import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, Locale } from './lib/i18n/config';

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1] as Locale;
  if (locales.includes(potentialLocale)) {
    return potentialLocale;
  }
  return null;
}

function getPreferredLocale(request: NextRequest): Locale {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0].toLowerCase();
    });

    for (const lang of languages) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and special Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/crop') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Check if path already has a locale
  const pathLocale = getLocaleFromPath(pathname);

  if (pathLocale) {
    // Path has a locale, continue
    return NextResponse.next();
  }

  // For the root path and paths without locale, serve default locale content
  // without redirect (better for SEO - English at root)
  if (pathname === '/' || !pathLocale) {
    // Rewrite to /en internally but keep URL as is
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
