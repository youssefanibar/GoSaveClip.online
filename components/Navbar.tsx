'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowDownToLine,
  Clock,
  BookOpen,
  Globe,
  ChevronDown,
  Menu,
  X,
  Music2,
  Headphones,
  Instagram,
  Camera,
  Facebook,
  Pin,
  Twitter,
} from 'lucide-react';
import { localeConfig, Locale } from '@/lib/i18n/config';
import { Dictionary } from '@/lib/i18n/get-dictionary';

interface NavbarProps {
  lang: string;
  dict: Dictionary['common'];
  onOpenHistory?: () => void;
  historyCount?: number;
  currentToolSlug?: string;
}

export function Navbar({
  lang,
  dict,
  onOpenHistory,
  historyCount = 0,
  currentToolSlug,
}: NavbarProps) {
  const pathname = usePathname();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const isRtl = lang === 'ar';

  // Compute equivalent URL for other language
  const getSwitchLangUrl = (targetLang: Locale) => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${targetLang}`;
    segments[0] = targetLang;
    return `/${segments.join('/')}`;
  };

  const navTools = [
    { name: dict.nav.tiktokVideo, href: `/${lang}/tiktok-video-downloader`, icon: Music2, slug: 'tiktok-video-downloader' },
    { name: dict.nav.instagramReels, href: `/${lang}/instagram-reels-downloader`, icon: Instagram, slug: 'instagram-reels-downloader' },
    { name: dict.nav.facebookVideo, href: `/${lang}/facebook-video-downloader`, icon: Facebook, slug: 'facebook-video-downloader' },
    { name: dict.nav.pinterestVideo, href: `/${lang}/pinterest-video-downloader`, icon: Pin, slug: 'pinterest-video-downloader' },
    { name: dict.nav.xVideo, href: `/${lang}/x-video-downloader`, icon: Twitter, slug: 'x-video-downloader' },
    { name: dict.nav.tiktokMp3, href: `/${lang}/tiktok-mp3-downloader`, icon: Headphones, slug: 'tiktok-mp3-downloader' },
    { name: dict.nav.instagramStory, href: `/${lang}/instagram-story-downloader`, icon: Camera, slug: 'instagram-story-downloader' },
  ];

  // Primary desktop links: Home, TikTok, Instagram, Facebook, Pinterest, X
  const primaryDesktopTools = navTools.slice(0, 5);
  // Secondary tools in More dropdown: TikTok MP3, Instagram Story
  const secondaryDesktopTools = navTools.slice(5);

  const isSecondaryActive = secondaryDesktopTools.some(
    (t) => pathname === t.href || currentToolSlug === t.slug
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/95 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5 group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform duration-200">
            <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                GoSave<span className="text-rose-500">Clip</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 hidden sm:inline">
              {dict.brandTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Single Row with all tools reachable) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-medium" aria-label="Main Navigation">
          <Link
            href={`/${lang}`}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              pathname === `/${lang}`
                ? 'text-white bg-slate-900 border border-slate-800 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            {dict.nav.home}
          </Link>
          {primaryDesktopTools.map((tool) => {
            const isActive = pathname === tool.href || currentToolSlug === tool.slug;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-white bg-slate-900 border border-slate-800 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {tool.name}
              </Link>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isSecondaryActive
                  ? 'text-white bg-slate-900 border border-slate-800 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-label={lang === 'ar' ? 'المزيد من الأدوات' : 'More tools'}
            >
              <span>{lang === 'ar' ? 'المزيد' : 'More'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreDropdownOpen ? 'rotate-180 text-rose-400' : ''
                }`}
              />
            </button>

            {moreDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreDropdownOpen(false)}
                />
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50`}>
                  {secondaryDesktopTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = pathname === tool.href || currentToolSlug === tool.slug;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                          isActive
                            ? 'text-rose-400 bg-rose-500/10 font-bold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <Link
            href={`/${lang}/blog`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              pathname?.includes('/blog')
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 font-semibold'
                : 'text-slate-300 hover:text-rose-400 hover:bg-slate-900/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>{dict.nav.blog}</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button (if handler provided) */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
              aria-label={dict.nav.history}
              title={dict.nav.history}
            >
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{dict.nav.history}</span>
              {historyCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>
          )}

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
              aria-label="Select language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{localeConfig[lang as Locale]?.nativeName || 'Language'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-36 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50`}>
                  <Link
                    href={getSwitchLangUrl('en')}
                    onClick={() => setLangDropdownOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      lang === 'en'
                        ? 'text-rose-400 bg-rose-500/10 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <span className="text-[10px] text-rose-400">✓</span>}
                  </Link>
                  <Link
                    href={getSwitchLangUrl('ar')}
                    onClick={() => setLangDropdownOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      lang === 'ar'
                        ? 'text-rose-400 bg-rose-500/10 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>العربية</span>
                    {lang === 'ar' && <span className="text-[10px] text-rose-400">✓</span>}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only shown when toggled, single row header otherwise) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-500 px-2">
            {lang === 'ar' ? 'أدوات التنزيل' : 'Download Tools'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href={`/${lang}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                pathname === `/${lang}`
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>{dict.nav.home}</span>
            </Link>
            {navTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{tool.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
            <Link
              href={`/${lang}/blog`}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>{dict.nav.blog}</span>
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'ar' ? 'مجاني للاستخدام · بدون تسجيل' : 'Free to Use · No Account Required'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
