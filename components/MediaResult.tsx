'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  FileVideo,
  FileImage,
  Music,
  CheckCircle2,
  Loader2,
  ArrowDownToLine,
} from 'lucide-react';
import { ExtractedMedia } from '@/app/api/extract/route';
import { trackDownload } from '@/lib/metrics';

interface MediaResultProps {
  media: ExtractedMedia;
  onReset: () => void;
  onSaveToHistory: (media: ExtractedMedia) => void;
}

export function MediaResult({ media, onReset, onSaveToHistory }: MediaResultProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(media.canonicalUrl || media.originalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSafeSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 30);
  };

  const handleDownload = async (downloadUrl: string, filename: string, qualityLabel: string) => {
    setDownloadingId(qualityLabel);
    onSaveToHistory(media);

    trackDownload({
      platform: media.platform || 'social',
      format: filename.endsWith('.mp3') ? 'audio' : filename.endsWith('.jpg') || filename.endsWith('.png') ? 'image' : 'video',
      quality: qualityLabel,
      filename,
    });

    const downloadHref = `/api/download?url=${encodeURIComponent(
      downloadUrl
    )}&filename=${encodeURIComponent(filename)}`;

    try {
      // 1. Fetch file as in-memory blob through server proxy (bypasses CORS/referrer blocks)
      const res = await fetch(downloadHref);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // 2. Trigger instant browser download from same-origin blob
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setDownloadSuccessToast(`Downloaded: ${filename}`);

      // 3. Clean up object URL after a short timeout
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
      }, 2000);
    } catch (err: any) {
      console.warn('In-memory blob download fallback triggered:', err);
      // Fallback: Trigger download via direct link navigation
      const fallbackAnchor = document.createElement('a');
      fallbackAnchor.style.display = 'none';
      fallbackAnchor.href = downloadHref;
      fallbackAnchor.download = filename;
      fallbackAnchor.target = '_blank';
      fallbackAnchor.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackAnchor);
      fallbackAnchor.click();
      setTimeout(() => fallbackAnchor.remove(), 1000);
      setDownloadSuccessToast(`Download started: ${filename}`);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 600);
      setTimeout(() => {
        setDownloadSuccessToast(null);
      }, 4000);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const mainVideoUrl = media.videoQualities?.[0]?.url;

  return (
    <section className="max-w-5xl mx-auto px-3 sm:px-6 mb-16 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Metadata and Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {media.author.avatarUrl && !avatarError ? (
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-700 shrink-0">
                <Image
                  src={media.author.avatarUrl}
                  alt={media.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                />
              </div>
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400 shrink-0 text-sm">
                {media.author.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 truncate">
                <span className="truncate">{media.author.name}</span>
                <span className="text-xs text-slate-400 font-normal shrink-0">@{media.author.username}</span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                <span className="capitalize">
                  {media.platform === 'x' ? 'X (Twitter)' : media.platform || media.type}
                </span>
                {media.views && (
                  <>
                    <span>•</span>
                    <span>{media.views} views</span>
                  </>
                )}
                {media.likes && (
                  <>
                    <span>•</span>
                    <span>{media.likes} likes</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onReset}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Download Another</span>
            </button>
          </div>
        </div>

        {/* Download success toast banner */}
        {downloadSuccessToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{downloadSuccessToast}</span>
          </div>
        )}

        {/* Main Content Grid: Preview on Left, Download Options on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-5 sm:mt-6">
          {/* Left Column: Player / Thumbnail Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-sm rounded-2xl overflow-hidden bg-black/60 border border-slate-800 aspect-[9/16] max-h-[380px] sm:max-h-[440px] flex items-center justify-center shadow-xl group">
              {media.type === 'video' && mainVideoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={mainVideoUrl}
                    poster={media.thumbnailUrl}
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  {/* Custom Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-end pointer-events-auto">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-center pointer-events-auto">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/90">
                      <span>{media.duration || '0:30'}</span>
                      <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-[11px]">HD 1080p</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={thumbError || !media.thumbnailUrl ? '/og-image.png' : media.thumbnailUrl}
                    alt={media.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                    onError={() => setThumbError(true)}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white uppercase tracking-wider">
                    {media.type === 'gif' ? 'Animated GIF' : 'High-Res Photo'}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-3 text-center">
              Watermark-free preview stream rendered in original aspect ratio
            </p>
          </div>

          {/* Right Column: Title & Download Options */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug break-words">
                {media.title}
              </h2>
              {media.description && (
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {media.description}
                </p>
              )}
            </div>

            {/* Video Download Options Section */}
            {media.videoQualities && media.videoQualities.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 truncate">
                    <FileVideo className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">Video Downloads (MP4)</span>
                  </h4>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    No Watermark
                  </span>
                </div>

                <div className="space-y-2.5">
                  {media.videoQualities.map((item) => {
                    const filename = `gosaveclip_${getSafeSlug(media.title)}_${item.label.toLowerCase().replace(/\s+/g, '_')}.mp4`;
                    const isBusy = downloadingId === item.label;

                    const hasNoWatermark = /no\s*watermark/i.test(item.label);
                    const cleanLabel = item.label
                      .replace(/\s*\(\s*no\s*watermark\s*\)/i, '')
                      .replace(/\s*no\s*watermark/i, '')
                      .trim();

                    return (
                      <div
                        key={item.label}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shadow-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                              {cleanLabel}
                            </span>
                            {hasNoWatermark && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                                No Watermark
                              </span>
                            )}
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                              {item.format}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span className="font-mono text-slate-300">{item.resolution}</span>
                            <span>•</span>
                            <span>Est. {item.sizeEstimate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          {/* Direct View / Open in Tab */}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-750"
                            title="Open video in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Primary Instant Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownload(item.url, filename, item.label)}
                            disabled={isBusy}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-950/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
                          >
                            {isBusy ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 stroke-[2.2]" />
                                <span>Download Video</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Image / Cover Download Options */}
            {media.imageQualities && media.imageQualities.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 truncate">
                    <FileImage className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">
                      {media.type === 'image' ? 'Image Download Options' : 'Original Cover & Poster'}
                    </span>
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">Direct Source</span>
                </div>

                <div className="space-y-2.5">
                  {media.imageQualities.map((item) => {
                    const filename = `gosaveclip_${getSafeSlug(media.title)}_${item.label.toLowerCase().replace(/\s+/g, '_')}.${item.format.toLowerCase()}`;
                    const isBusy = downloadingId === item.label;

                    return (
                      <div
                        key={item.label}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shadow-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                              {item.format}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{item.dimensions}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-750"
                            title="Open image in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDownload(item.url, filename, item.label)}
                            disabled={isBusy}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-600 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
                          >
                            {isBusy ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 text-amber-400 stroke-[2.2]" />
                                <span>Download Image</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Audio Track Option */}
            {media.audioUrl && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                      Extract Audio Only (MP3)
                    </span>
                    <p className="text-[11px] text-slate-400 truncate">Save original background audio track</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href={media.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                    title="Open audio in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        media.audioUrl!,
                        `gosaveclip_audio_${getSafeSlug(media.title)}.mp3`,
                        'audio'
                      )
                    }
                    disabled={downloadingId === 'audio'}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-75"
                  >
                    {downloadingId === 'audio' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-3.5 h-3.5 text-purple-400" />
                        <span>Download MP3</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Direct Link fallback */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <a
                href={media.canonicalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-slate-300 flex items-center gap-1 transition-colors truncate max-w-[260px]"
              >
                <span>
                  View on {media.platform === 'tiktok' ? 'TikTok' : media.platform === 'instagram' ? 'Instagram' : media.platform === 'facebook' ? 'Facebook' : 'Pinterest'}
                </span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className="font-mono text-[11px]">ID: {media.id}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
