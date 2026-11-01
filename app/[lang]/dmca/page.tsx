import React from 'react';
import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Copyright, Mail } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const data = dict.pages.dmca;
  const canonicalUrl = `${SITE_URL}/${lang}/dmca`;

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/dmca`,
        ar: `${SITE_URL}/ar/dmca`,
        'x-default': `${SITE_URL}/en/dmca`,
      },
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDesc,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function DmcaPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const dmca = dict.pages.dmca;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lang={lang}
            items={[{ label: dmca.title }]}
            homeLabel={dict.common.breadcrumbs.home}
          />

          <header className="mt-8 mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <Copyright className="w-3.5 h-3.5" />
              <span>{dmca.subtitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {dmca.title}
            </h1>
          </header>

          <article className="space-y-6">
            {dmca.sections.map((sec, idx) => (
              <section
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {sec.title}
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {sec.content}
                </p>
              </section>
            ))}

            <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950/30 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">
                  {lang === 'ar' ? 'إرسال إشعار الألفية الرقمية' : 'Submit a DMCA Notice'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === 'ar'
                    ? 'فريقنا القانوني يراجع البلاغات ويرد خلال 24 ساعة عمل.'
                    : 'Our designated copyright agent responds to verified inquiries within 24 business hours.'}
                </p>
              </div>
              <a
                href="mailto:dmca@gosaveclip.online"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                <Mail className="w-4 h-4" />
                <span>dmca@gosaveclip.online</span>
              </a>
            </div>
          </article>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
