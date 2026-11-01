import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { TOOL_SLUGS, TOOLS, isValidToolSlug, ToolSlug } from '@/lib/tools-config';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import { getAllPosts } from '@/lib/blogs';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DownloaderSection } from '@/components/DownloaderSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { HowToGuide } from '@/components/HowToGuide';
import { FeatureGrid } from '@/components/FeatureGrid';
import { SeoArticle } from '@/components/SeoArticle';
import { FaqSection } from '@/components/FaqSection';
import { WebApplicationJsonLd, FaqPageJsonLd } from '@/components/JsonLd';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface ToolPageProps {
  params: Promise<{
    lang: string;
    tool: string;
  }>;
}

export async function generateStaticParams() {
  const params: { lang: string; tool: string }[] = [];
  for (const lang of locales) {
    for (const tool of TOOL_SLUGS) {
      params.push({ lang, tool });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { lang, tool } = await params;
  if (!isValidToolSlug(tool)) {
    return {};
  }

  const dict = await getDictionary(lang);
  const toolData = dict.tools[tool as ToolSlug];
  if (!toolData) return {};

  const title = toolData.metaTitle;
  const description = toolData.metaDesc;
  const canonicalUrl = `${SITE_URL}/${lang}/${tool}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/${tool}`,
        ar: `${SITE_URL}/ar/${tool}`,
        'x-default': `${SITE_URL}/en/${tool}`,
      },
    },
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
          alt: `${toolData.title} - ${SITE_NAME}`,
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
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { lang, tool } = await params;

  if (!isValidToolSlug(tool)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const toolConfig = TOOLS[tool];
  const toolData = dict.tools[tool];

  if (!toolData) {
    notFound();
  }

  // Related tools & blog posts
  const relatedTools = TOOL_SLUGS
    .filter((slug) => slug !== tool)
    .map((slug) => ({
      slug,
      title: dict.tools[slug as ToolSlug]?.title || slug,
      desc: dict.tools[slug as ToolSlug]?.subtitle || '',
    }));

  const allPosts = getAllPosts(lang);
  let relatedBlogs = allPosts.filter((post) =>
    toolConfig.relatedBlogSlugs.includes(post.slug)
  );
  if (relatedBlogs.length < 3) {
    const extra = allPosts.filter((post) => !relatedBlogs.some((b) => b.slug === post.slug));
    relatedBlogs = [...relatedBlogs, ...extra].slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Schema Markup: WebApplication & FAQPage */}
      <WebApplicationJsonLd
        name={toolData.title}
        description={toolData.metaDesc}
        url={`${SITE_URL}/${lang}/${tool}`}
      />
      {toolData.faqs && toolData.faqs.length > 0 && (
        <FaqPageJsonLd faqs={toolData.faqs} />
      )}

      {/* Top Navbar */}
      <Navbar lang={lang} dict={dict.common} currentToolSlug={tool} />

      <main className="flex-1">
        {/* Breadcrumbs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs
            lang={lang}
            items={[
              { label: dict.common.breadcrumbs.tools, href: `/${lang}#tools` },
              { label: toolData.title },
            ]}
            homeLabel={dict.common.breadcrumbs.home}
          />
        </div>

        {/* Hero & Dedicated Tool Box with Unique H1 */}
        <DownloaderSection
          lang={lang}
          badgeText={toolData.badge}
          title={toolData.title}
          highlightedText={toolData.highlightedText}
          subtitle={toolData.subtitle}
          inputPlaceholder={toolData.placeholder}
          sampleUrl={toolConfig.popularSampleUrl}
          sampleBadge={toolConfig.sampleBadge}
          dictCommon={dict.common}
        />

        {/* 150+ Words Intro Paragraph Section */}
        {toolData.introParagraph && (
          <section className="py-8 md:py-12 border-t border-slate-900 bg-slate-950/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {lang === 'ar' ? 'نبذة عن الأداة' : `About ${toolData.title}`}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {toolData.introParagraph}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Step-by-Step How To Guide */}
        <HowToGuide
          title={toolData.howToTitle}
          subtitle={dict.home.howToSubtitle}
          steps={toolData.howToSteps}
        />

        {/* Unique Feature Grid */}
        <FeatureGrid
          title={toolData.featuresTitle}
          subtitle={dict.home.featuresSubtitle}
          features={toolData.features}
        />

        {/* In-depth SEO Editorial Article */}
        <SeoArticle
          title={toolData.articleTitle}
          content={toolData.articleContent}
        />

        {/* Platform-Specific FAQ Section (3-5 FAQs) */}
        <FaqSection
          title={lang === 'ar' ? 'أسئلة شائعة حول الأداة' : `${toolData.title} FAQ`}
          subtitle={dict.home.faqSubtitle}
          faqs={toolData.faqs}
        />

        {/* Related Tools Internal Links */}
        {relatedTools.length > 0 && (
          <section className="py-12 border-t border-slate-800/60 bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {lang === 'ar' ? 'أدوات تنزيل الوسائط الأخرى' : 'Other Downloader Tools'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((relTool) => (
                  <Link
                    key={relTool.slug}
                    href={`/${lang}/${relTool.slug}`}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-rose-400 transition-colors flex items-center justify-between">
                        <span>{relTool.title}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 rtl:rotate-180" />
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                        {relTool.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'جودة أصلية مجاناً' : 'Original Quality Free'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Blog Guides Internal Links (2-3 related guides) */}
        {relatedBlogs.length > 0 && (
          <section className="py-12 border-t border-slate-800/60 bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {lang === 'ar' ? 'أدلة وشروحات ذات صلة' : 'Related Guides & Tutorials'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${lang}/blog/${post.slug}`}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {post.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>{post.readTime}</span>
                      <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 rtl:group-hover:-translate-x-1">
                        {lang === 'ar' ? 'قراءة الدليل' : 'Read Guide'} &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Global Footer */}
      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
