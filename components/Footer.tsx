'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownToLine, Shield, BookOpen, Heart, Mail } from 'lucide-react';
import { Dictionary } from '@/lib/i18n/get-dictionary';
import { TOOL_SLUGS, TOOLS } from '@/lib/tools-config';

interface FooterProps {
  lang: string;
  dict: Dictionary['common'];
}

export function Footer({ lang, dict }: FooterProps) {
  const isRtl = lang === 'ar';

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link href={`/${lang}`} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center text-white shadow-md">
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg text-white">
                GoSave<span className="text-rose-500">Clip</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              {dict.footer.description}
            </p>
            <div className="flex items-center gap-2 pt-2 text-slate-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{dict.footer.sslBadge}</span>
            </div>
          </div>

          {/* Dedicated Download Tools Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {dict.footer.toolsHeader}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href={`/${lang}/tiktok-video-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.tiktokVideo}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/tiktok-mp3-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.tiktokMp3}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/instagram-reels-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.instagramReels}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/instagram-story-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.instagramStory}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/facebook-video-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.facebookVideo}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/pinterest-video-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.pinterestVideo}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/x-video-downloader`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.xVideo}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {dict.footer.resourcesHeader}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href={`/${lang}/blog`}
                  className="hover:text-rose-400 text-rose-400 font-medium transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{dict.nav.blog}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/about`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/privacy`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/dmca`} className="hover:text-rose-400 transition-colors">
                  {dict.nav.dmca}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright Bottom */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <p className="max-w-2xl text-justify sm:text-left">
            {dict.disclaimer}
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} GoSaveClip. {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
