'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ExtractedMedia } from '@/app/api/extract/route';
import { trackExtraction } from '@/lib/metrics';

interface HeroDownloaderProps {
  lang?: string;
  onMediaExtracted: (media: ExtractedMedia) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  activeTab?: 'all' | 'video' | 'image' | 'gif';
  setActiveTab?: (tab: 'all' | 'video' | 'image' | 'gif') => void;
  badgeText?: string;
  headline?: string;
  highlightedHeadline?: string;
  subtitle?: string;
  placeholder?: string;
  customSamples?: Array<{
    id: string;
    label: string;
    badge: string;
    url: string;
  }>;
}

const DEFAULT_SAMPLE_CHIPS: Array<{
  id: string;
  label: string;
  badge: string;
  url: string;
}> = [];

function extractCleanUrl(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  const match = trimmed.match(/https?:\/\/[^\s<>"]+/i);
  if (match) {
    return match[0].replace(/[.,;:!)]+$/, '');
  }
  return trimmed;
}

export function HeroDownloader({
  lang = 'en',
  onMediaExtracted,
  isLoading,
  setIsLoading,
  badgeText = 'Universal Social Video & Audio Downloader',
  headline = 'Download Social Videos & Audio in',
  highlightedHeadline = 'Full HD 1080p',
  subtitle = 'Paste any link from TikTok, Instagram, Facebook, Pinterest, or X to download clean MP4 videos, watermark-free clips, high-res photos, and MP3 audio instantly.',
  placeholder = 'Paste link from TikTok, Instagram, Facebook, Pinterest, or X...',
  customSamples,
}: HeroDownloaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const samples = customSamples || DEFAULT_SAMPLE_CHIPS;

  const handleFetch = async (targetUrl?: string) => {
    const rawTarget = targetUrl !== undefined ? targetUrl : urlInput;
    const cleanUrl = extractCleanUrl(rawTarget);

    if (!cleanUrl) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى لصق أو إدخال رابط فيديو صالح من تيك توك، انستغرام، فيسبوك، بنترست، أو إكس.'
          : 'Please paste or enter a valid TikTok, Instagram, Facebook, Pinterest, or X link.'
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not parse media from this link.');
      }

      trackExtraction({
        platform: data.data?.platform || 'social',
        success: true,
      });

      onMediaExtracted(data.data);
    } catch (err: any) {
      trackExtraction({
        platform: 'social',
        success: false,
        error: err.message,
      });

      setErrorMessage(
        err.message || (lang === 'ar'
          ? 'تعذر استخراج الوسائط من هذا الرابط. يرجى التأكد من أن المنشور عام والمحاولة مرة أخرى.'
          : 'Unable to download media from this URL. Please verify the post is public and try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setErrorMessage(null);
    handleFetch(sampleUrl);
  };

  return (
    <section id="downloader" className="relative pt-10 pb-14 md:pt-16 md:pb-20 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-950/25 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Anti-slop clean kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{badgeText}</span>
          <span className="text-slate-500">·</span>
          <span className="text-rose-400 font-medium">{lang === 'ar' ? 'مجاني · بدون تسجيل' : 'Free to use · No registration'}</span>
        </div>

        {/* Main H1 Headline (Exactly one per page) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15]">
          {headline}
          {highlightedHeadline ? (
            <>
              {' '}
              <span className="text-rose-500 bg-gradient-to-r from-rose-500 via-red-500 to-rose-400 bg-clip-text text-transparent">
                {highlightedHeadline}
              </span>
            </>
          ) : null}
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Platform Quick Switchers */}
        <div className="mt-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap justify-start sm:justify-center scrollbar-none py-1 px-1 text-xs sm:text-sm font-semibold -mx-2 sm:mx-0">
          <Link
            href={`/${lang}`}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white shadow-sm shrink-0"
          >
            {lang === 'ar' ? 'جميع المنصات' : 'All Platforms'}
          </Link>
          <Link
            href={`/${lang}/tiktok-video-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'تيك توك' : 'TikTok Video'}
          </Link>
          <Link
            href={`/${lang}/tiktok-mp3-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'صوت تيك توك' : 'TikTok MP3'}
          </Link>
          <Link
            href={`/${lang}/instagram-reels-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'ريلز انستغرام' : 'Instagram Reels'}
          </Link>
          <Link
            href={`/${lang}/facebook-video-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'فيديو فيسبوك' : 'Facebook Video'}
          </Link>
          <Link
            href={`/${lang}/x-video-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'إكس (تويتر)' : 'X / Twitter'}
          </Link>
          <Link
            href={`/${lang}/pinterest-video-downloader`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'بنترست' : 'Pinterest Video'}
          </Link>
        </div>

        {/* Main Input Box Container */}
        <div className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetch();
            }}
            className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-rose-950/20 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-3.5 rtl:left-auto rtl:right-3.5 text-slate-400 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={placeholder}
                className="w-full bg-transparent pl-11 pr-20 rtl:pr-11 rtl:pl-20 py-3.5 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
                disabled={isLoading}
                aria-label={placeholder}
              />
              <div className="absolute right-2.5 rtl:right-auto rtl:left-2.5 flex items-center gap-1.5">
                {urlInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput('');
                      setErrorMessage(null);
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        if (clipText) {
                          const clean = extractCleanUrl(clipText);
                          setUrlInput(clean || clipText);
                          setCopiedNotification(true);
                          setTimeout(() => setCopiedNotification(false), 2500);
                        }
                      } catch {
                        inputRef.current?.focus();
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? 'لصق' : 'Paste'}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-600 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-900/40 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shrink-0 min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <span>{lang === 'ar' ? 'تحميل' : 'Download'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* User Trust & Usage Note Under Input Box (Requirement 9) */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'قم بتنزيل المحتوى الذي تملكه أو لديك إذن باستخدامه فقط.'
                : 'Only download content you own or have permission to use.'}
            </span>
          </div>

          {/* Toast Notification on Paste Clean */}
          {copiedNotification && (
            <div className="mt-2 text-xs text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تم لصق الرابط والتعرف عليه تلقائياً!' : 'Link detected and cleaned automatically!'}</span>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm text-left rtl:text-right flex items-start gap-2.5 shadow-lg animate-in fade-in" role="alert">
              <span className="text-red-400 font-bold shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Quick-try Sample Link Chips (rendered only if verified samples provided) */}
          {samples && samples.length > 0 && (
            <div className="mt-4 flex items-center flex-wrap gap-2 text-xs text-slate-400 justify-center">
              <span className="text-slate-400 font-medium">{lang === 'ar' ? 'جرّب رابطاً تجريبياً:' : 'Try a sample:'}</span>
              {samples.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSampleClick(chip.url)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[11px] disabled:opacity-50"
                >
                  <span>{chip.label}</span>
                  <span className="text-[10px] px-1 rounded bg-slate-800 text-rose-400 font-mono font-medium">
                    {chip.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
