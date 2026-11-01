'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { pageview, trackWebVitals } from '@/lib/metrics';

export function GoogleMetrics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  // 1. Report Core Web Vitals to Google Analytics (CLS, LCP, INP, FCP, TTFB)
  useReportWebVitals((metric) => {
    trackWebVitals({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating as 'good' | 'needs-improvement' | 'poor' | undefined,
    });
  });

  // 2. Track SPA pageviews on client-side route transitions
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
