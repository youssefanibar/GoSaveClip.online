import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
          <span className="text-3xl font-black">404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found | GoSaveClip
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
          The requested page could not be found. Return to GoSaveClip to download videos and audio.
        </p>

        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to GoSaveClip</span>
        </Link>
      </body>
    </html>
  );
}
