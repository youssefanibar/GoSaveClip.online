'use client';

import React from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, Lightbulb, Smartphone, ShieldCheck } from 'lucide-react';

interface SeoArticleProps {
  title?: string;
  content?: string;
  highlights?: Array<{ title: string; description: string }>;
}

export function SeoArticle({
  title = 'What is GoSaveClip Universal Downloader?',
  content,
  highlights,
}: SeoArticleProps) {
  return (
    <section className="py-16 md:py-24 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="prose prose-invert max-w-none text-slate-300 space-y-12">
          {/* Main Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-2.5">
              <span className="w-2 h-7 bg-rose-500 rounded-full inline-block" />
              {title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {content || (
                <>
                  <strong>GoSaveClip</strong> is a modern, high-performance web-based utility created to help
                  designers, creators, students, and curators save publicly shared social media footage. Whether you
                  need to save a viral dance reel from TikTok, an inspirational cooking recipe, a woodworking tutorial
                  from Facebook Watch, or an aerospace launch from X, GoSaveClip extracts the direct CDN media stream
                  and delivers a pristine, watermark-free MP4 or MP3 file.
                </>
              )}
            </p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-3">
              Unlike many web downloaders filled with intrusive popups and deceptive overlays, GoSaveClip provides a
              safe and fast experience without requiring user registration, email
              submission, or browser plugins.
            </p>
          </div>

          {/* Highlights Grid if provided */}
          {highlights && highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h3 className="font-semibold text-white text-sm mb-1">{h.title}</h3>
                  <p className="text-xs text-slate-400">{h.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* iPhone / iOS Guide */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-rose-400" />
              How to Save Videos Directly to iPhone Camera Roll
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Saving video files directly to Apple Photos on an iPhone or iPad used to require complex workflow shortcuts.
              With GoSaveClip and modern iOS Safari, it takes just a few seconds:
            </p>
            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-300 pl-4 rtl:pr-4 rtl:pl-0 list-decimal">
              <li>
                In your chosen app (TikTok, Instagram, Facebook, Pinterest, or X), tap <strong>Share</strong> and choose{' '}
                <strong>Copy Link</strong>.
              </li>
              <li>
                Open <strong>Safari</strong> on your iPhone and visit <strong>GoSaveClip</strong>.
              </li>
              <li>
                Paste your link into the input box and tap <strong>Download</strong>.
              </li>
              <li>
                Under Download Options, select your preferred video quality. Safari will prompt you to confirm the download.
              </li>
              <li>
                Tap the small blue download icon in Safari’s address bar, select your downloaded MP4 file, tap the{' '}
                <strong>Share icon</strong>, and choose <strong>&quot;Save Video&quot;</strong>. The video is now safely in your Photos app!
              </li>
            </ol>
          </div>

          {/* Supported Formats */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Supported Media Formats &amp; Resolutions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-white text-sm mb-1">High-Definition Video (up to 1080p)</h4>
                <p className="text-xs text-slate-400">
                  Extracted in high quality (up to 1080p, depending on source upload) with synchronized stereo audio
                  compatible with all smartphones, tablets, and editing software.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-white text-sm mb-1">High-Resolution Photos</h4>
                <p className="text-xs text-slate-400">
                  Download images in the highest resolution the platform provides.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-white text-sm mb-1">Animated GIFs to MP4</h4>
                <p className="text-xs text-slate-400">
                  Downloads animated GIF loops in both original .GIF format and compressed .MP4 video loop
                  format for lighter file size and smoother playback.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-semibold text-white text-sm mb-1">Isolated Audio MP3</h4>
                <p className="text-xs text-slate-400">
                  Extracts speech, podcasts, voiceovers, and trending songs into standalone high-quality MP3 audio
                  files suitable for ringtones or offline listening.
                </p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/40">
            <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Troubleshooting Common Download Issues
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Private or Protected Accounts:</strong> GoSaveClip can only access publicly accessible posts.
                  If a post is in a private group, private account, or secret board, it cannot be downloaded.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Shortened Links:</strong> Short links created through mobile share sheets
                  (e.g., vt.tiktok.com, pin.it, fb.watch, t.co) are fully supported and automatically resolved.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Deleted Posts:</strong> If a creator has removed their post or the video was taken down by the platform,
                  the URL will return an extraction error.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
