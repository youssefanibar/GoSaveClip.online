/**
 * Google Metrics & Analytics Module for GoSaveClip
 * Supports:
 * - Google Analytics 4 (GA4) with Measurement ID
 * - Google Tag Manager (GTM) dataLayer compatibility
 * - Google Core Web Vitals (CLS, INP, LCP, FCP, TTFB)
 * - Custom social media download and extraction event tracking
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_ID ||
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GTAG_ID ||
  'G-EL0Y4NDL2R';

export const GSC_VERIFICATION_TOKEN = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';

// Type-safe declarations for window object with Google Analytics & Tag Manager
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Record a pageview in Google Analytics
 */
export function pageview(url: string, title?: string): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
      page_location: window.location.href,
      page_path: url,
      send_to: GA_MEASUREMENT_ID,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'pageview',
      page_path: url,
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    });
  }
}

/**
 * Track generic custom event in Google Analytics
 */
export function trackEvent({
  action,
  category = 'General',
  label,
  value,
  params = {},
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: typeof value === 'number' ? Math.round(value) : undefined,
      ...params,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      event_value: value,
      ...params,
    });
  }
}

/**
 * Track media download initiated by user (TikTok, Instagram, Facebook, X, Pinterest)
 */
export function trackDownload({
  platform,
  format,
  quality,
  filename,
}: {
  platform: string;
  format: 'video' | 'audio' | 'image' | string;
  quality?: string;
  filename?: string;
}): void {
  trackEvent({
    action: 'download_media',
    category: 'Media Download',
    label: `${platform} - ${format} (${quality || 'standard'})`,
    params: {
      platform,
      format,
      quality: quality || 'standard',
      filename,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track URL extraction submission
 */
export function trackExtraction({
  platform,
  success,
  durationMs,
  error,
}: {
  platform: string;
  success: boolean;
  durationMs?: number;
  error?: string;
}): void {
  trackEvent({
    action: success ? 'extraction_success' : 'extraction_failure',
    category: 'Extractor',
    label: `${platform} - ${success ? 'OK' : error || 'Failed'}`,
    value: durationMs,
    params: {
      platform,
      success,
      duration_ms: durationMs,
      error_message: error,
    },
  });
}

/**
 * Track Core Web Vitals metric directly into Google Analytics
 */
export function trackWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  delta?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
}): void {
  if (typeof window === 'undefined') return;

  // Google Analytics requires integer value
  const formattedValue = Math.round(
    metric.name === 'CLS' ? metric.value * 1000 : metric.value
  );

  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: formattedValue,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating || 'good',
      non_interaction: true,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'core_web_vitals',
      web_vital_name: metric.name,
      web_vital_id: metric.id,
      web_vital_value: metric.value,
      web_vital_rating: metric.rating,
    });
  }
}
