'use client';

import React, { useState } from 'react';
import { HeroDownloader } from './HeroDownloader';
import { MediaResult } from './MediaResult';
import { ExtractedMedia } from '@/app/api/extract/route';
import { useHistory } from '@/hooks/useHistory';

interface DownloaderSectionProps {
  lang: string;
  badgeText?: string;
  headline?: string;
  title?: string;
  highlightedHeadline?: string;
  highlightedText?: string;
  subtitle?: string;
  placeholder?: string;
  inputPlaceholder?: string;
  sampleUrl?: string;
  sampleBadge?: string;
  customSamples?: Array<{
    id: string;
    label: string;
    badge: string;
    url: string;
  }>;
  dictCommon?: any;
}

export function DownloaderSection({
  lang,
  badgeText,
  headline,
  title,
  highlightedHeadline,
  highlightedText,
  subtitle,
  placeholder,
  inputPlaceholder,
  sampleUrl,
  sampleBadge,
  customSamples,
}: DownloaderSectionProps) {
  const [extractedMedia, setExtractedMedia] = useState<ExtractedMedia | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { saveToHistory } = useHistory();

  const handleMediaExtracted = (media: ExtractedMedia) => {
    setExtractedMedia(media);
    saveToHistory(media);
    setTimeout(() => {
      window.scrollTo({
        top: 360,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleReset = () => {
    setExtractedMedia(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolvedSamples = customSamples;

  return (
    <div>
      <HeroDownloader
        lang={lang}
        onMediaExtracted={handleMediaExtracted}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        badgeText={badgeText}
        headline={headline ?? title}
        highlightedHeadline={highlightedHeadline ?? highlightedText ?? ''}
        subtitle={subtitle}
        placeholder={placeholder || inputPlaceholder}
        customSamples={resolvedSamples}
      />

      {extractedMedia && (
        <MediaResult
          media={extractedMedia}
          onReset={handleReset}
          onSaveToHistory={saveToHistory}
        />
      )}
    </div>
  );
}
