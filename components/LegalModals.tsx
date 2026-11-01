'use client';

import React from 'react';
import { X, ShieldCheck, Scale, FileText } from 'lucide-react';

interface LegalModalsProps {
  type: 'terms' | 'privacy' | 'dmca' | null;
  onClose: () => void;
}

export function LegalModals({ type, onClose }: LegalModalsProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 z-10 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-500">
            {type === 'terms' && <Scale className="w-5 h-5" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
            {type === 'dmca' && <FileText className="w-5 h-5" />}
            <h3 className="font-bold text-lg text-white">
              {type === 'terms' && 'Terms of Service'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'dmca' && 'DMCA & Copyright Notice'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-400 leading-relaxed overflow-y-auto pr-1">
          {type === 'terms' && (
            <>
              <p>
                Welcome to <strong>GoSaveClip</strong>. By using our website and services, you agree to comply with
                and be bound by the following terms and conditions.
              </p>
              <h4 className="font-bold text-white text-sm">1. Intended Personal Use</h4>
              <p>
                GoSaveClip is designed exclusively for personal, educational, and backup purposes. You are solely
                responsible for respecting original content creators’ rights under international copyright
                laws.
              </p>
              <h4 className="font-bold text-white text-sm">2. Non-Affiliation</h4>
              <p>
                GoSaveClip is an independent utility and is not affiliated, endorsed, certified, or sponsored by
                ByteDance, Meta, Pinterest, or X. All trademarks and logos belong to their respective owners.
              </p>
              <h4 className="font-bold text-white text-sm">3. Limitation of Liability</h4>
              <p>
                GoSaveClip does not host, store, or archive copyrighted media on its servers. We do not accept
                liability for misuse or redistribution of downloaded content by third parties.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                Your privacy is of utmost importance to us. This policy details how GoSaveClip treats your data.
              </p>
              <h4 className="font-bold text-white text-sm">1. Zero Personal Data Collection</h4>
              <p>
                We do not require user accounts, email addresses, credit cards, or passwords. We do not track or
                profile your browsing habits across other websites.
              </p>
              <h4 className="font-bold text-white text-sm">2. Media Processing</h4>
              <p>
                When you paste a media URL, our servers query public metadata to extract direct media streams.
                Media files are streamed directly to your browser and are never retained on our disk or
                databases.
              </p>
              <h4 className="font-bold text-white text-sm">3. Local Storage</h4>
              <p>
                If you choose to use the &quot;Recent Downloads&quot; history feature, that information is stored solely
                within your browser’s localStorage on your personal device, and is never transmitted to us.
              </p>
            </>
          )}

          {type === 'dmca' && (
            <>
              <p>
                GoSaveClip operates in strict compliance with the Digital Millennium Copyright Act (17 U.S.C. §
                512) and international intellectual property regulations.
              </p>
              <h4 className="font-bold text-white text-sm">1. No Media Hosted</h4>
              <p>
                GoSaveClip does NOT host, store, broadcast, or republish any videos, photos, or audio on its own
                servers. All extracted media is hosted directly on source platforms&apos; content delivery networks.
              </p>
              <h4 className="font-bold text-white text-sm">2. Takedown Requests</h4>
              <p>
                Because no files are stored on GoSaveClip, the most effective way to remove infringing content is
                to file a copyright complaint directly with the original hosting platform. Once
                the post is removed or marked private, GoSaveClip will automatically fail to extract it.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
