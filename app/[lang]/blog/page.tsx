import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts } from '@/lib/blogs';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BookOpen } from 'lucide-react';
import { BlogIndexClient } from '@/components/BlogIndexClient';

interface BlogIndexProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: BlogIndexProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const data = dict.blog;
  const canonicalUrl = `${SITE_URL}/${lang}/blog`;

  return {
    title: data.indexMetaTitle,
    description: data.indexMetaDesc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog`,
        ar: `${SITE_URL}/ar/blog`,
        'x-default': `${SITE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: data.indexMetaTitle,
      description: data.indexMetaDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${data.indexTitle} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.indexMetaTitle,
      description: data.indexMetaDesc,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const blogDict = dict.blog;
  const posts = getAllPosts(lang);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lang={lang}
            items={[{ label: dict.common.breadcrumbs.blog }]}
            homeLabel={dict.common.breadcrumbs.home}
          />

          <header className="mt-8 mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'أحدث الأدلة والشروحات' : 'Latest Tutorials & Tips'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {blogDict.indexTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              {blogDict.indexSubtitle}
            </p>
          </header>

          <BlogIndexClient
            posts={posts}
            lang={lang}
            readMoreLabel={blogDict.readMore}
          />
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
