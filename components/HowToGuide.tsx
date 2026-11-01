'use client';

import React, { useState } from 'react';
import { Smartphone, Monitor, Copy, ArrowDownToLine, Sparkles } from 'lucide-react';

export interface HowToStep {
  step: string;
  title: string;
  description: string;
}

interface HowToGuideProps {
  title?: string;
  subtitle?: string;
  steps?: HowToStep[];
}

const DEFAULT_STEPS: HowToStep[] = [
  {
    step: '01',
    title: 'Copy Video or Media Link',
    description: 'Open TikTok, Instagram, Facebook, Pinterest, or X. Find the video, reel, or photo you wish to download, tap Share, and select "Copy Link".',
  },
  {
    step: '02',
    title: 'Paste URL into GoSaveClip',
    description: 'Paste the copied URL into the input field above. GoSaveClip automatically resolves shortened links (like vt.tiktok.com or pin.it) in milliseconds.',
  },
  {
    step: '03',
    title: 'Download Clean MP4 / MP3',
    description: 'Choose your preferred quality (high quality MP4, 720p, or Audio MP3) and click Download to save the clean file directly to your device.',
  },
];

export function HowToGuide({
  title = 'How to Download Videos Online with GoSaveClip',
  subtitle = 'Save any media file directly to your smartphone, tablet, or PC in 3 simple steps.',
  steps = DEFAULT_STEPS,
}: HowToGuideProps) {
  const [deviceTab, setDeviceTab] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <section id="how-to" className="py-16 md:py-24 border-t border-slate-900 bg-slate-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
            Simple 3-Step Process
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {subtitle}
          </p>

          {/* Device Switcher Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setDeviceTab('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                deviceTab === 'mobile'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile (iOS / Android)</span>
            </button>
            <button
              onClick={() => setDeviceTab('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                deviceTab === 'desktop'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>PC / Mac / Chrome</span>
            </button>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((stepItem, idx) => {
            const stepNum = stepItem.step || `0${idx + 1}`;
            const colors = [
              {
                bg: 'bg-rose-500/10',
                text: 'text-rose-400',
                border: 'border-rose-500/20',
                icon: Copy,
                badge: 'Fast URL copy',
              },
              {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                icon: Sparkles,
                badge: 'Auto-detect link',
              },
              {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-400',
                border: 'border-emerald-500/20',
                icon: ArrowDownToLine,
                badge: 'Crisp video',
              },
            ];
            const color = colors[idx % colors.length];
            const Icon = color.icon;

            return (
              <div
                key={stepNum}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${color.bg} ${color.text} border ${color.border} flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-105 transition-transform`}
                  >
                    {stepNum}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{stepItem.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                <div
                  className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs ${color.text} font-medium`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{color.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
