'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Download, ExternalLink, Clock, PlayCircle } from 'lucide-react';
import { ExtractedMedia } from '@/app/api/extract/route';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExtractedMedia[];
  onClearHistory: () => void;
  onSelectMedia: (media: ExtractedMedia) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectMedia,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-white">Recent Downloads ({history.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty State */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Clock className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-300">No downloads yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Downloaded or extracted media will appear here during your session.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex gap-3 items-center group"
                >
                  <div
                    onClick={() => {
                      onSelectMedia(item);
                      onClose();
                    }}
                    className="relative w-14 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <Image
                      src={item.thumbnailUrl || '/og-image.png'}
                      alt={item.title || 'Media thumbnail'}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        onSelectMedia(item);
                        onClose();
                      }}
                      className="text-xs font-semibold text-white line-clamp-1 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                      {item.type} Pin · {item.author.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onSelectMedia(item);
                          onClose();
                        }}
                        className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Re-open
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Clear All */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onClearHistory}
                className="w-full py-2.5 rounded-xl border border-rose-900/50 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Download History</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
