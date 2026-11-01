import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import '../globals.css';
import { locales, Locale, localeConfig } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { SITE_URL, SITE_NAME, BRAND_TAGLINE } from '@/lib/site-config';
import { GA_MEASUREMENT_ID, GSC_VERIFICATION_TOKEN } from '@/lib/metrics';
import { GoogleMetrics } from '@/components/GoogleMetrics';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const title = dict.home.metaTitle;
  const description = dict.home.metaDesc;
  const canonicalUrl = `${SITE_URL}/${lang}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        'x-default': `${SITE_URL}/en`,
      },
    },
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${BRAND_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
      creator: '@gosaveclip',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'ar' ? 'ar' : 'en') as Locale;
  const isRtl = validLang === 'ar';
  const gscVerification = GSC_VERIFICATION_TOKEN;
  const measurementId = GA_MEASUREMENT_ID;

  return (
    <html lang={validLang} dir={isRtl ? 'rtl' : 'ltr'}>
      <head>
        {/* Google Search Console verification meta tag */}
        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}
        {/* Preload Google Fonts for Arabic & Latin typography with font-display: swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white ${
          isRtl ? 'font-arabic' : 'font-sans'
        }`}
      >
        {children}

        {/* Google Metrics & Analytics (GA4 / GTM / Web Vitals) */}
        {measurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${measurementId}');
                `,
              }}
            />
            <Suspense fallback={null}>
              <GoogleMetrics />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
