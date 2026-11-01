import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts, getPostBySlug } from '@/lib/blogs';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Calendar, Clock, Sparkles, Tag, List, ArrowRight } from 'lucide-react';

interface BlogPostProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    const posts = getAllPosts(lang);
    for (const post of posts) {
      params.push({ lang, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug, lang);
  if (!post) return {};

  const title = (post.metaTitle || post.title).slice(0, 60);
  const description = (post.metaDescription || post.description).slice(0, 155);
  const canonicalUrl = `${SITE_URL}/${lang}/blog/${slug}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog/${slug}`,
        ar: `${SITE_URL}/ar/blog/${slug}`,
        'x-default': `${SITE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'article',
      publishedTime: post.datePublished || post.date,
      modifiedTime: post.dateModified || post.date,
      authors: [post.author.name],
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const post = getPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/${lang}/blog/${slug}`;
  const allPosts = getAllPosts(lang);
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Extract headings for the Table of Contents
  const lines = post.content.split('\n');
  const headings: { text: string; id: string; level: number }[] = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').trim();
      headings.push({ text, id: slugify(text), level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').trim();
      headings.push({ text, id: slugify(text), level: 3 });
    }
  });

  const hasBeenUpdated = Boolean(post.dateModified && post.dateModified !== post.datePublished);
  const toolPageHref = `/${lang}/${post.toolSlug || ''}`;

  // Complete JSON-LD Schema graph: Article, HowTo, FAQPage, BreadcrumbList
  const jsonLdGraph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: post.title,
      description: post.metaDescription || post.description,
      image: `${SITE_URL}/og-image.png`,
      datePublished: post.datePublished || post.date,
      dateModified: post.dateModified || post.date,
      author: {
        '@type': 'Organization',
        name: 'GoSaveClip Team',
        url: `${SITE_URL}/${lang}/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dict.common.breadcrumbs?.home || 'Home',
          item: `${SITE_URL}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dict.common.breadcrumbs?.blog || 'Blog',
          item: `${SITE_URL}/${lang}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (post.steps && post.steps.length > 0) {
    jsonLdGraph.push({
      '@type': 'HowTo',
      '@id': `${canonicalUrl}#howto`,
      name: post.title,
      description: post.metaDescription || post.description,
      step: post.steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
        url: `${canonicalUrl}#step-${idx + 1}`,
      })),
    });
  }

  if (post.faq && post.faq.length > 0) {
    jsonLdGraph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Complete JSON-LD Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': jsonLdGraph,
          }),
        }}
      />

      <Navbar lang={lang} dict={dict.common} />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Visible Breadcrumbs: Home > Blog > Post Title */}
          <Breadcrumbs
            lang={lang}
            items={[
              { label: dict.common.breadcrumbs?.blog || 'Blog', href: `/${lang}/blog` },
              { label: post.title },
            ]}
            homeLabel={dict.common.breadcrumbs?.home || 'Home'}
          />

          <article className="mt-8">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {lang === 'ar' ? `تاريخ النشر: ${post.date}` : `Published: ${post.date}`}
                </span>
                {hasBeenUpdated && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span>{lang === 'ar' ? `آخر تحديث: ${post.dateModified}` : `Last updated: ${post.dateModified}`}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Author linking to /en/about */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center gap-3">
                <Link
                  href={`/${lang}/about`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 ring-2 ring-rose-500/20 shadow-md group-hover:ring-rose-500/40 transition-all">
                    GC
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm group-hover:text-rose-400 transition-colors">
                      {post.author.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {post.author.role}
                    </div>
                  </div>
                </Link>
              </div>
            </header>

            {/* TOP CTA BUTTON: Direct access to matching tool page */}
            {post.toolSlug && (
              <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {lang === 'ar' ? 'هل تريد حفظ الفيديو الآن مباشرة؟' : 'Ready to save this video right now?'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lang === 'ar'
                        ? `استخدم أداة ${post.toolName} السريعة والمجانية بدون تثبيت برامج.`
                        : `Use our free ${post.toolName} for instant, high-quality downloads.`}
                    </div>
                  </div>
                </div>
                <Link
                  href={toolPageHref}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm text-center shadow-lg shadow-rose-600/20 transition-all shrink-0 inline-flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'ar' ? 'فتح أداة التنزيل' : `Open ${post.toolName}`}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            )}

            {/* Table of Contents with working anchor IDs */}
            {headings.length > 0 && (
              <nav
                aria-label="Table of contents"
                className="mb-10 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4 text-white font-bold text-base">
                  <List className="w-4 h-4 text-rose-500" />
                  <span>{lang === 'ar' ? 'فهرس المقال' : 'Table of Contents'}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {headings.map((h) => (
                    <li
                      key={h.id}
                      className={`${h.level === 3 ? 'pl-4 rtl:pr-4' : ''}`}
                    >
                      <a
                        href={`#${h.id}`}
                        className="text-slate-300 hover:text-rose-400 transition-colors inline-block"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Content Body with Markdown Rendering */}
            <div className="prose prose-invert prose-slate max-w-none text-slate-200">
              <Markdown
                components={{
                  h1: () => null, // H1 is already rendered above
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h2
                        id={id}
                        className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-slate-800 scroll-mt-24"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h3
                        id={id}
                        className="text-xl font-bold text-white mt-8 mb-3 scroll-mt-24"
                      >
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="text-slate-200 leading-relaxed mb-5 text-base sm:text-lg">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 ml-6 list-disc text-slate-200 text-base sm:text-lg">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-6 ml-6 list-decimal text-slate-200 text-base sm:text-lg">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <Link
                      href={href || '#'}
                      className="text-rose-400 hover:text-rose-300 underline font-medium transition-colors"
                    >
                      {children}
                    </Link>
                  ),
                  hr: () => <hr className="border-slate-800 my-10" />,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-rose-500 pl-4 py-1 italic bg-rose-500/5 rounded-r my-6 text-slate-300">
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt }) => {
                    const imageSrc = typeof src === 'string' ? src : '';
                    if (!imageSrc) return null;
                    return (
                      <span className="block my-8 rounded-2xl overflow-hidden border border-slate-800">
                        <Image
                          src={imageSrc}
                          alt={alt || post.title}
                          width={800}
                          height={450}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </span>
                    );
                  },
                }}
              >
                {post.content}
              </Markdown>
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 mr-2 rtl:ml-2 rtl:mr-0">
                <Tag className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'الوسوم:' : 'Tags:'}
              </span>
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* BOTTOM CTA BOX: Direct button to matching tool page */}
            {post.toolSlug && (
              <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{SITE_NAME}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {lang === 'ar' ? `استخدم أداة ${post.toolName} الآن` : `Save Media with ${post.toolName}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                    {lang === 'ar'
                      ? 'احفظ مقاطع الفيديو والصوت بجودة عالية مجاناً وبكل سهولة من أي جهاز.'
                      : 'Free, fast, and secure social media extraction directly to your device.'}
                  </p>
                </div>
                <Link
                  href={toolPageHref}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all whitespace-nowrap inline-flex items-center gap-2"
                >
                  <span>{lang === 'ar' ? 'فتح أداة التنزيل' : `Open ${post.toolName}`}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            )}
          </article>

          {/* Related Guides Block */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-slate-800" aria-label="Related guides">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {lang === 'ar' ? 'أدلة وشروحات ذات صلة' : 'Related Guides'}
                </h2>
                <Link
                  href={`/${lang}/blog`}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'كافة المقالات' : 'View all'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.slug}
                    href={`/${lang}/blog/${rPost.slug}`}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {rPost.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors mt-2.5 line-clamp-2">
                        {rPost.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                        {rPost.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>{rPost.readTime}</span>
                      <span className="text-rose-400 font-medium group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                        {lang === 'ar' ? 'قراءة' : 'Read'} &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer lang={lang} dict={dict.common} />
    </div>
  );
}
