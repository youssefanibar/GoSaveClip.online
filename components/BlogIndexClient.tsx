'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blogs';
import {
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Video,
  Film,
  Share2,
  Compass,
  Sparkles,
  FileText,
  BookOpen,
} from 'lucide-react';

interface BlogIndexClientProps {
  posts: BlogPost[];
  lang: string;
  readMoreLabel: string;
  showingLabel?: string;
  allLabel?: string;
}

const CATEGORIES = [
  'All',
  'TikTok',
  'Instagram',
  'Facebook',
  'X',
  'Pinterest',
  'General',
] as const;

function getCategoryIcon(cat: string) {
  switch (cat.toLowerCase()) {
    case 'tiktok':
      return <Video className="w-5 h-5 text-cyan-400" />;
    case 'instagram':
      return <Film className="w-5 h-5 text-fuchsia-400" />;
    case 'facebook':
      return <Share2 className="w-5 h-5 text-blue-400" />;
    case 'x':
      return <Compass className="w-5 h-5 text-slate-300" />;
    case 'pinterest':
      return <Sparkles className="w-5 h-5 text-rose-400" />;
    default:
      return <FileText className="w-5 h-5 text-emerald-400" />;
  }
}

function getCategoryStyle(cat: string) {
  switch (cat.toLowerCase()) {
    case 'tiktok':
      return {
        bg: 'from-cyan-950/40 via-slate-900 to-rose-950/30',
        border: 'border-cyan-500/20 group-hover:border-cyan-500/40',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      };
    case 'instagram':
      return {
        bg: 'from-fuchsia-950/40 via-slate-900 to-rose-950/30',
        border: 'border-fuchsia-500/20 group-hover:border-fuchsia-500/40',
        badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      };
    case 'facebook':
      return {
        bg: 'from-blue-950/40 via-slate-900 to-indigo-950/30',
        border: 'border-blue-500/20 group-hover:border-blue-500/40',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      };
    case 'x':
      return {
        bg: 'from-slate-800/50 via-slate-900 to-slate-950',
        border: 'border-slate-700/40 group-hover:border-slate-600',
        badge: 'bg-slate-800 text-slate-300 border-slate-700/50',
      };
    case 'pinterest':
      return {
        bg: 'from-rose-950/40 via-slate-900 to-red-950/30',
        border: 'border-rose-500/20 group-hover:border-rose-500/40',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      };
    default:
      return {
        bg: 'from-emerald-950/40 via-slate-900 to-teal-950/30',
        border: 'border-emerald-500/20 group-hover:border-emerald-500/40',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      };
  }
}

export function BlogIndexClient({
  posts,
  lang,
  readMoreLabel,
}: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [posts, selectedCategory]);

  const getCategoryLabel = (cat: string) => {
    if (lang !== 'ar') return cat;
    switch (cat) {
      case 'All':
        return 'الكل';
      case 'TikTok':
        return 'تيك توك';
      case 'Instagram':
        return 'انستغرام';
      case 'Facebook':
        return 'فيسبوك';
      case 'X':
        return 'إكس (تويتر)';
      case 'Pinterest':
        return 'بنترست';
      case 'General':
        return 'أدلة عامة';
      default:
        return cat;
    }
  };

  return (
    <div>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 rtl:mr-0 rtl:ml-2">
          <Filter className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-semibold uppercase tracking-wider">
            {lang === 'ar' ? 'التصنيف:' : 'Filter:'}
          </span>
        </div>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === 'All'
              ? posts.length
              : posts.filter(
                  (p) => p.category.toLowerCase() === cat.toLowerCase()
                ).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40 border border-rose-400/30'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>{getCategoryLabel(cat)}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-rose-600/80 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-400 px-1">
        <span>
          {lang === 'ar'
            ? `عرض ${filteredPosts.length} من إجمالي ${posts.length} مقال`
            : `Showing ${filteredPosts.length} of ${posts.length} guides`}
        </span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
          >
            {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filter'}
          </button>
        )}
      </div>

      {/* Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <BookOpen className="w-8 h-8 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">
            {lang === 'ar' ? 'لا توجد مقالات في هذا القسم حالياً' : 'No guides found in this category'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar' ? 'اختر تصنيفاً آخر لمشاهدة الأدلة المتاحة.' : 'Try selecting another category to browse tutorials.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const style = getCategoryStyle(post.category);
            const icon = getCategoryIcon(post.category);

            return (
              <article
                key={post.slug}
                className={`group flex flex-col bg-slate-900/80 border rounded-2xl overflow-hidden transition-all shadow-lg hover:shadow-rose-950/20 hover:-translate-y-0.5 ${style.border}`}
              >
                {/* Styled Editorial Header (Zero Unowned Images) */}
                <div
                  className={`h-36 sm:h-40 w-full bg-gradient-to-br ${style.bg} p-5 flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Decorative subtle ambient circle */}
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${style.badge}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-400 block truncate">
                        {post.toolName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{post.date}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/${lang}/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="mt-2.5 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Branded Vector Monogram Avatar (100% Owned) */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                        GC
                      </div>
                      <Link
                        href={post.author.url || `/${lang}/about`}
                        className="text-xs text-slate-300 font-medium hover:text-white transition-colors"
                      >
                        {post.author.name}
                      </Link>
                    </div>

                    <Link
                      href={`/${lang}/blog/${post.slug}`}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 transition-colors group/link"
                    >
                      <span>{readMoreLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5 transition-transform rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
