import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { TOOL_SLUGS, TOOLS } from '@/lib/tools-config';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
        <span className="text-3xl font-black">404</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
        The link or downloader you requested could not be found or may have moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to GoSaveClip Home</span>
        </Link>
      </div>

      <div className="max-w-md w-full pt-8 border-t border-slate-800">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Popular Downloaders:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            href="/en/tiktok-video-downloader"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            TikTok Downloader
          </Link>
          <Link
            href="/en/instagram-reels-downloader"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Instagram Reels
          </Link>
          <Link
            href="/en/facebook-video-downloader"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Facebook Video
          </Link>
          <Link
            href="/en/x-video-downloader"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            X (Twitter) Video
          </Link>
        </div>
      </div>
    </div>
  );
}
