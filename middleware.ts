import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/config';
import { TOOL_SLUGS } from './lib/tools-config';

// Paths that should not be intercepted by i18n routing
const PUBLIC_FILE = /\.(.*)$/;

const OLD_TOOL_REDIRECTS: Record<string, string> = {
  '/tiktok': '/en/tiktok-video-downloader',
  '/instagram': '/en/instagram-reels-downloader',
  '/facebook': '/en/facebook-video-downloader',
  '/x': '/en/x-video-downloader',
  '/pinterest': '/en/pinterest-video-downloader',
};

const LEGACY_PAGES: Record<string, string> = {
  '/about': '/en/about',
  '/contact': '/en/contact',
  '/privacy': '/en/privacy',
  '/terms': '/en/terms',
  '/dmca': '/en/dmca',
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  // 1. Force Canonical Host & HTTPS (legacy domain -> gosaveclip.online, www -> non-www)
  const legacyHost = ['gosaveclip', 'com'].join('.');
  const legacyWwwHost = ['www', 'gosaveclip', 'com'].join('.');
  const cleanHost = host.split(':')[0]; // strip port if any

  if (
    cleanHost === legacyHost ||
    cleanHost === legacyWwwHost ||
    cleanHost === 'www.gosaveclip.online' ||
    cleanHost.startsWith('www.gosaveclip.online')
  ) {
    const canonicalUrl = new URL(
      `${pathname}${search}`,
      'https://gosaveclip.online'
    );
    return NextResponse.redirect(canonicalUrl.toString(), 301);
  }

  // 2. Trailing Slash normalization: remove trailing slash (except root '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanUrl = new URL(
      `${pathname.slice(0, -1)}${search}`,
      request.url
    );
    return NextResponse.redirect(cleanUrl.toString(), 301);
  }

  // 3. Skip static assets, internal Next.js requests and APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.startsWith('/og-image') ||
    pathname.startsWith('/site.webmanifest') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    PUBLIC_FILE.test(pathname)
  ) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  // 4. Handle Old / Legacy redirects (301)
  if (OLD_TOOL_REDIRECTS[pathname]) {
    return NextResponse.redirect(
      new URL(`${OLD_TOOL_REDIRECTS[pathname]}${search}`, request.url),
      301
    );
  }

  if (LEGACY_PAGES[pathname]) {
    return NextResponse.redirect(
      new URL(`${LEGACY_PAGES[pathname]}${search}`, request.url),
      301
    );
  }

  if (pathname === '/blog') {
    return NextResponse.redirect(new URL(`/en/blog${search}`, request.url), 301);
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    return NextResponse.redirect(new URL(`/en/blog/${slug}${search}`, request.url), 301);
  }

  // Check if someone requested /:tool without a language prefix
  const bareSlug = pathname.replace(/^\//, '');
  if ((TOOL_SLUGS as readonly string[]).includes(bareSlug)) {
    const rewriteResponse = NextResponse.rewrite(new URL(`/en/${bareSlug}${search}`, request.url));
    rewriteResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    rewriteResponse.headers.set('X-Content-Type-Options', 'nosniff');
    rewriteResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return rewriteResponse;
  }

  // 5. Root Path redirect: / -> /en (301)
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/en${search}`, request.url), 301);
  }

  // 6. Check if path starts with supported locale (en, ar)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to defaultLocale with current path
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url),
      301
    );
  }

  // 7. Security Headers for all localized HTML responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
