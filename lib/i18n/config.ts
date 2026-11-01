export const defaultLocale = 'en' as const;

export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export interface LocaleMeta {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  hreflang: string;
}

export const localeConfig: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
    hreflang: 'en',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
    hreflang: 'ar',
  },
};

export function isValidLocale(lang: string): lang is Locale {
  return (locales as readonly string[]).includes(lang);
}

export function getLocaleDirection(lang: string): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}
