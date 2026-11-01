import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { locales } from '@/lib/i18n/config';
import { TOOL_SLUGS } from '@/lib/tools-config';
import { getAllPosts } from '@/lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const createLocalizedEntry = (
    path: string,
    priority: number = 0.8,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    lastModifiedDate: Date = currentDate
  ) => {
    locales.forEach((lang) => {
      const canonical = `${SITE_URL}/${lang}${path}`;
      const alternates: Record<string, string> = {
        'x-default': `${SITE_URL}/en${path}`,
      };
      locales.forEach((l) => {
        alternates[l] = `${SITE_URL}/${l}${path}`;
      });

      entries.push({
        url: canonical,
        lastModified: lastModifiedDate,
        changeFrequency,
        priority: lang === 'en' ? priority : priority - 0.05,
        alternates: {
          languages: alternates,
        },
      });
    });
  };

  // 1. Home Pages (Priority 1.0)
  createLocalizedEntry('', 1.0, 'daily');

  // 2. Tool Pages (Priority 0.9)
  TOOL_SLUGS.forEach((toolSlug) => {
    createLocalizedEntry(`/${toolSlug}`, 0.9, 'daily');
  });

  // 3. Blog Index (Priority 0.8)
  createLocalizedEntry('/blog', 0.8, 'weekly');

  // 4. Blog Posts (Priority 0.7)
  const posts = getAllPosts('en');
  posts.forEach((post) => {
    const postDate = post.dateModified ? new Date(post.dateModified) : currentDate;
    createLocalizedEntry(`/blog/${post.slug}`, 0.7, 'weekly', postDate);
  });

  // 5. Legal & Info Pages (Priority 0.5)
  const infoPages = ['/about', '/contact', '/privacy', '/terms', '/dmca'];
  infoPages.forEach((pagePath) => {
    createLocalizedEntry(pagePath, 0.5, 'monthly');
  });

  return entries;
}
