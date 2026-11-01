'use client';

import React from 'react';
import {
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Smartphone,
  EyeOff,
  CloudLightning,
  UserCheck,
} from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: 'High-Resolution Video & Audio',
    description:
      'GoSaveClip extracts the highest available bitrate and resolution stored on CDN servers without compression loss.',
  },
  {
    title: 'Zero Added Watermarks',
    description:
      'Get clean MP4 video files without added logos, watermarks, or branding overlays. Ready for sharing, editing, or archiving.',
  },
  {
    title: 'No Registration Needed',
    description:
      'Start downloading immediately without creating an account, entering email addresses, or setting passwords.',
  },
  {
    title: 'Fast Processing Speed',
    description:
      'Our distributed edge network parses media objects and streams directly to your browser with minimal waiting time.',
  },
  {
    title: 'Works on Any Device',
    description:
      'Compatible with Safari on iOS (iPhone & iPad), Chrome on Android, Windows, macOS, Linux, and all modern browsers.',
  },
  {
    title: 'Private & Anonymous',
    description:
      'All requests are processed through encrypted HTTPS channels. We never store personal search history or host files on our servers.',
  },
];

const ICONS = [Tv, Sparkles, UserCheck, CloudLightning, Smartphone, EyeOff];
const COLORS = [
  'text-rose-500 bg-rose-500/10 border-rose-500/20',
  'text-amber-500 bg-amber-500/10 border-amber-500/20',
  'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'text-sky-500 bg-sky-500/10 border-sky-500/20',
  'text-purple-500 bg-purple-500/10 border-purple-500/20',
  'text-teal-500 bg-teal-500/10 border-teal-500/20',
];

export function FeatureGrid({
  title = 'Why People Choose GoSaveClip',
  subtitle = 'Discover why creators and curators prefer our seamless, high-speed media extraction engine.',
  features = DEFAULT_FEATURES,
}: FeatureGridProps) {
  const isFourCards = features.length === 4;

  return (
    <section id="features" className="py-16 md:py-24 border-t border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
            Engineered For Speed &amp; Quality
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {subtitle}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${
            isFourCards
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : 'sm:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {features.map((feature, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const color = COLORS[idx % COLORS.length];

            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-0.5 duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
