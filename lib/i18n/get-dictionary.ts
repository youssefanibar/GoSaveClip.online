import 'server-only';
import type { Locale } from './config';

// Import JSON dictionaries directly for synchronous or fast cached resolution
import enDict from './dictionaries/en.json';
import arDict from './dictionaries/ar.json';

const dictionaries: Record<Locale, typeof enDict> = {
  en: enDict,
  ar: arDict,
};

export type Dictionary = typeof enDict;

export async function getDictionary(locale: string): Promise<Dictionary> {
  const normalized = (locale === 'ar' ? 'ar' : 'en') as Locale;
  return dictionaries[normalized] || dictionaries.en;
}

export function getDictionarySync(locale: string): Dictionary {
  const normalized = (locale === 'ar' ? 'ar' : 'en') as Locale;
  return dictionaries[normalized] || dictionaries.en;
}
