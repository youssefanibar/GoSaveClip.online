'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqJsonLd } from './JsonLd';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  faqs?: FaqItem[];
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is GoSaveClip completely free to use?',
    answer:
      'Yes, GoSaveClip is a free web utility with no registration required. You do not need to create an account, enter credit card details, or pay any subscription fees. Enjoy access to all video and audio download tools at zero cost.',
  },
  {
    question: 'Does GoSaveClip remove TikTok watermarks?',
    answer:
      'Yes. When you paste a TikTok link into GoSaveClip, our server connects to the raw origin CDN stream prior to the client watermark application. This ensures your saved video is completely clean, without bouncing logos or creator handles stamped over the video.',
  },
  {
    question: 'Where are downloaded files saved on my device?',
    answer:
      'On Android phones and desktop computers, files are saved directly into your device\'s default "Downloads" folder. On iPhone and iPad using Safari, downloaded videos appear in your Files app under Downloads. From there, you can tap Share and select "Save Video" to move it straight to your Camera Roll.',
  },
  {
    question: 'Do I need to install software or browser extensions?',
    answer:
      'No software, app, or browser extension is required to use GoSaveClip. The service operates entirely within any standard web browser, including Safari, Chrome, Firefox, and Edge. Just paste your link and download directly without cluttering your device storage.',
  },
  {
    question: 'Does GoSaveClip store copies of downloaded files?',
    answer:
      'No. GoSaveClip does not host, store, or archive user media files on its servers. All video and audio streams are proxied transiently in real time from public social networks directly to your device. We respect user confidentiality and do not log download history.',
  },
  {
    question: 'How do I download TikTok videos on iPhone?',
    answer:
      'To download on an iPhone, open the TikTok app, tap Share on your chosen video, and copy the link. Next, open Safari, navigate to GoSaveClip, paste the link, and tap Download. When Safari prompts you, tap Download, then open your Safari downloads manager to save the video to your Photos library.',
  },
  {
    question: 'Why does my download fail or say "video unavailable"?',
    answer:
      'Downloads may fail if the target post is set to private, deleted by the creator, or restricted by country or age filters. Verify that the post is publicly accessible in an incognito browser window. If the link is valid and public, try refreshing the page or checking your internet connection.',
  },
  {
    question: 'Is it legal to download videos from social media?',
    answer:
      'The legality of downloading videos depends on the content itself, the platform\'s terms of service, and your local jurisdiction\'s copyright laws. Downloading videos for personal offline archiving, educational fair use, or backing up your own creative uploads is generally acceptable. However, downloading copyrighted content that you do not own or lack explicit permission to use may infringe copyright. Users are solely responsible for how they use and distribute any downloaded media.',
  },
];

export function FaqSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about downloading social media with GoSaveClip.',
  items,
  faqs,
}: FaqSectionProps) {
  const faqList = faqs || items || DEFAULT_FAQ_ITEMS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <FaqJsonLd faqs={faqList} />
      <section id="faq" className="py-16 md:py-24 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="space-y-3" role="region" aria-label="FAQ Accordion">
            {faqList.map((item, index) => {
              const isOpen = openIndex === index;
              const contentId = `faq-answer-${index}`;
              const buttonId = `faq-question-${index}`;

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left rtl:text-right flex items-center justify-between gap-4 text-white hover:text-rose-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                  >
                    <span className="font-semibold text-sm sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-rose-500' : ''
                      }`}
                    />
                  </button>

                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`transition-all duration-300 ease-in-out overflow-hidden px-5 sm:px-6 text-xs sm:text-sm text-slate-300 leading-relaxed ${
                      isOpen
                        ? 'max-h-96 pb-5 sm:pb-6 pt-3 border-t border-slate-800/50 opacity-100'
                        : 'max-h-0 pb-0 pt-0 border-t-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
