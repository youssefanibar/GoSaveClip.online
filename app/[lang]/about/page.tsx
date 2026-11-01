import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const data = dict.pages.about;
  const canonicalUrl = `${SITE_URL}/${lang}/about`;

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/about`,
        ar: `${SITE_URL}/ar/about`,
        'x-default': `${SITE_URL}/en/about`,
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

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const about = dict.pages.about;

  const valueIcons = [ShieldCheck, Zap, Globe];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lang={lang}
            items={[{ label: about.title }]}
            homeLabel={dict.common.breadcrumbs.home}
          />

          <header className="mt-8 mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {about.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              {about.subtitle}
            </p>
          </header>

          {/* Mission */}
          <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 mb-10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              {about.missionTitle}
            </h2>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
              {about.missionText}
            </p>
          </section>

          {/* Core Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {about.valuesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.values.map((val, idx) => {
                const Icon = valueIcons[idx] || ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {val.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA to Tools */}
          <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-rose-950/30 to-purple-950/30 border border-rose-500/20">
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ar' ? 'جاهز لحفظ مقاطعك المفضلة؟' : 'Ready to Save Your Favorite Videos?'}
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              {lang === 'ar'
                ? 'جرب تنزيل مقاطع تيك توك بدون علامة مائية وريلز إنستغرام بجودة عالية مجاناً وبنقرة واحدة.'
                : 'Experience watermark-free TikTok clips, Instagram Reels, and Full HD videos with one click.'}
            </p>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-lg shadow-rose-500/25 transition-all text-sm"
            >
              <span>{lang === 'ar' ? 'الانتقال إلى أداة التنزيل' : 'Start Downloading Now'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
