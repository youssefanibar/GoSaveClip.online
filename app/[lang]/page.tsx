import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales } from '@/lib/i18n/config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DownloaderSection } from '@/components/DownloaderSection';
import { HowToGuide } from '@/components/HowToGuide';
import { FeatureGrid } from '@/components/FeatureGrid';
import { SeoArticle } from '@/components/SeoArticle';
import { FaqSection } from '@/components/FaqSection';
import { WebSiteJsonLd, WebApplicationJsonLd } from '@/components/JsonLd';
import { getAllPosts } from '@/lib/blogs';
import { SITE_URL } from '@/lib/site-config';
import { ArrowRight, BookOpen, Music2, Headphones, Instagram, Camera, Facebook, Pin, Twitter, Sparkles } from 'lucide-react';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const recentPosts = getAllPosts(lang).slice(0, 3);

  const toolsList = [
    {
      slug: 'tiktok-video-downloader',
      title: dict.common.nav.tiktokVideo,
      desc: dict.tools['tiktok-video-downloader'].subtitle,
      badge: 'Watermark-Free (up to 1080p)',
      icon: Music2,
      color: 'from-cyan-500 to-rose-500',
    },
    {
      slug: 'tiktok-mp3-downloader',
      title: dict.common.nav.tiktokMp3,
      desc: dict.tools['tiktok-mp3-downloader'].subtitle,
      badge: 'High-Quality MP3',
      icon: Headphones,
      color: 'from-rose-500 to-amber-500',
    },
    {
      slug: 'instagram-reels-downloader',
      title: dict.common.nav.instagramReels,
      desc: dict.tools['instagram-reels-downloader'].subtitle,
      badge: 'Audio (source quality)',
      icon: Instagram,
      color: 'from-fuchsia-500 to-rose-500',
    },
    {
      slug: 'instagram-story-downloader',
      title: dict.common.nav.instagramStory,
      desc: dict.tools['instagram-story-downloader'].subtitle,
      badge: 'Up to 1080p (source quality)',
      icon: Camera,
      color: 'from-amber-500 to-purple-500',
    },
    {
      slug: 'facebook-video-downloader',
      title: dict.common.nav.facebookVideo,
      desc: dict.tools['facebook-video-downloader'].subtitle,
      badge: 'Up to 1080p',
      icon: Facebook,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      slug: 'pinterest-video-downloader',
      title: dict.common.nav.pinterestVideo,
      desc: dict.tools['pinterest-video-downloader'].subtitle,
      badge: 'Up to 1080p (source quality)',
      icon: Pin,
      color: 'from-red-600 to-rose-600',
    },
    {
      slug: 'x-video-downloader',
      title: dict.common.nav.xVideo,
      desc: dict.tools['x-video-downloader'].subtitle,
      badge: 'Up to 60fps MP4',
      icon: Twitter,
      color: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Schema: WebSite + Organization & WebApplication */}
      <WebSiteJsonLd lang={lang} />
      <WebApplicationJsonLd
        name={dict.common.brandName}
        description={dict.home.metaDesc}
        url={`${SITE_URL}/${lang}`}
        applicationCategory="MultimediaApplication"
      />

      {/* Top Navbar */}
      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1">
        {/* Hero & Downloader Input Area */}
        <DownloaderSection
          lang={lang}
          badgeText={dict.home.badge}
          headline={dict.home.heroTitle}
          highlightedHeadline={dict.home.heroTitleHighlight}
          subtitle={dict.home.heroSubtitle}
          placeholder={dict.common.input.placeholderDefault}
        />

        {/* Dedicated Downloader Tools Cards */}
        <section className="py-12 border-t border-slate-900 bg-slate-950/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                {dict.home.allToolsTitle}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                {dict.home.allToolsSubtitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolsList.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/${lang}/${tool.slug}`}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 block group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-rose-400 border border-slate-700/60">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 rtl:group-hover:-translate-x-0 rtl:rotate-180 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to Guide (3 Steps) */}
        <HowToGuide
          title={dict.home.howToTitle}
          subtitle={dict.home.howToSubtitle}
          steps={dict.home.howToSteps}
        />

        {/* Feature Grid */}
        <FeatureGrid
          title={dict.home.featuresTitle}
          subtitle={dict.home.featuresSubtitle}
          features={dict.home.features}
        />

        {/* In-Depth SEO Guide (300+ words unique text) */}
        <SeoArticle />

        {/* FAQ Section with FAQPage JSON-LD */}
        <FaqSection
          title={dict.home.faqTitle}
          subtitle={dict.home.faqSubtitle}
          items={dict.home.faqs}
        />

        {/* Recent Blog Guides Section */}
        {recentPosts.length > 0 && (
          <section className="py-14 border-t border-slate-900 bg-slate-950/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    {dict.common.nav.blog}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {dict.blog.indexTitle}
                  </h2>
                </div>
                <Link
                  href={`/${lang}/blog`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <span>{dict.blog.readMore}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${lang}/blog/${post.slug}`}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col group transition-all hover:-translate-y-1"
                  >
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold text-[10px]">
                            {post.category}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-rose-400 transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                        <span>{post.date}</span>
                        <span className="text-rose-400 font-medium group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                          {dict.blog.readMore} →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
