import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbsJsonLd, BreadcrumbItem } from './JsonLd';
import { SITE_URL } from '@/lib/site-config';

export interface BreadcrumbItemInput {
  name?: string;
  label?: string;
  url?: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItemInput[];
  lang: string;
  homeLabel?: string;
}

export function Breadcrumbs({ items, lang, homeLabel }: BreadcrumbsProps) {
  const isRtl = lang === 'ar';

  // Normalize items to BreadcrumbItem for JSON-LD and UI
  const normalizedItems = [
    ...(homeLabel ? [{ name: homeLabel, url: `/${lang}` }] : []),
    ...items.map((it) => ({
      name: it.name || it.label || '',
      url: it.url || it.href || '',
    })),
  ];

  return (
    <>
      <BreadcrumbsJsonLd
        items={normalizedItems.map((it) => ({
          name: it.name,
          url: it.url ? `${SITE_URL}${it.url.startsWith('/') ? it.url : '/' + it.url}` : SITE_URL,
        }))}
      />
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
          {normalizedItems.map((item, idx) => {
            const isLast = idx === normalizedItems.length - 1;
            return (
              <li key={`${item.name}-${idx}`} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-600 shrink-0 ${isRtl ? 'rotate-180' : ''}`}
                  />
                )}
                {isLast || !item.url ? (
                  <span className="text-rose-400 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="w-3 h-3" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
