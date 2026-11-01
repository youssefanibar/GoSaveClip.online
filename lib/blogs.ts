import { BlogPost } from './blog-data/types';
import { postTikTok } from './blog-data/tiktok';
import { postInstagram } from './blog-data/instagram';
import { postFacebook } from './blog-data/facebook';
import { postX } from './blog-data/x';
import { postPinterest } from './blog-data/pinterest';
import { newBlogPosts } from './blog-data/new-posts';

export type { BlogPost, BlogPostFaqItem, BlogPostHowToStep } from './blog-data/types';

export const BLOG_POSTS: BlogPost[] = [
  postTikTok,
  postInstagram,
  postFacebook,
  postX,
  postPinterest,
  ...newBlogPosts,
];

export const AR_BLOG_POSTS: BlogPost[] = [
  {
    ...postTikTok,
    title: 'تحميل فيديوهات تيك توك بدون علامة مائية (دليل 2026)',
    metaTitle: 'تحميل فيديوهات تيك توك بدون علامة مائية (دليل 2026)',
    description: 'تعرف على كيفية تحميل فيديوهات تيك توك بدون علامة مائية بدقة 1080p وحفظها في معرض الصور بهاتفك أو حاسوبك مجاناً عبر GoSaveClip.',
    metaDescription: 'تعرف على كيفية تحميل فيديوهات تيك توك بدون علامة مائية بدقة 1080p وحفظها في معرض الصور بهاتفك أو حاسوبك مجاناً عبر GoSaveClip.',
    date: '18 أكتوبر 2026',
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: '/og-image.png',
      url: '/ar/about',
    },
    tags: ['تيك توك', 'بدون علامة مائية', 'تحميل فيديو', 'شروحات'],
  },
  {
    ...postInstagram,
    title: 'حفظ ريلز انستغرام مع الصوت في ألبوم الصور (دليل 2026)',
    metaTitle: 'حفظ ريلز انستغرام مع الصوت في ألبوم الصور (دليل 2026)',
    description: 'دليل شامل لحفظ ريلز انستغرام مع الصوت والموسيقى كاملة في ألبوم الصور بهواتف آيفون وأندرويد والكمبيوتر بجودة عالية.',
    metaDescription: 'دليل شامل لحفظ ريلز انستغرام مع الصوت والموسيقى كاملة في ألبوم الصور بهواتف آيفون وأندرويد والكمبيوتر بجودة عالية.',
    date: '15 أكتوبر 2026',
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: '/og-image.png',
      url: '/ar/about',
    },
    tags: ['انستغرام', 'ريلز', 'صوت وموسيقى', 'شروحات'],
  },
  {
    ...postFacebook,
    title: 'تحميل فيديوهات فيسبوك بدقة 1080p Full HD (دليل 2026)',
    metaTitle: 'تحميل فيديوهات فيسبوك بدقة 1080p Full HD (دليل 2026)',
    description: 'تعلم كيفية تحميل فيديوهات فيسبوك ووتش والريلز العامة بدقة 1080p Full HD دون الحاجة لتثبيت أي برامج على آيفون وأندرويد والكمبيوتر.',
    metaDescription: 'تعلم كيفية تحميل فيديوهات فيسبوك ووتش والريلز العامة بدقة 1080p Full HD دون الحاجة لتثبيت أي برامج على آيفون وأندرويد والكمبيوتر.',
    date: '10 أكتوبر 2026',
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: '/og-image.png',
      url: '/ar/about',
    },
    tags: ['فيسبوك', 'ريلز', '1080p', 'شروحات'],
  },
  {
    ...postX,
    title: 'تحميل فيديوهات وصور متحركة من إكس تويتر (دليل 2026)',
    metaTitle: 'تحميل فيديوهات وصور متحركة من إكس تويتر (دليل 2026)',
    description: 'طريقة تحميل فيديوهات إكس تويتر بجودة 1080p HD وحفظ الصور المتحركة بصيغة MP4 للهاتف والكمبيوتر مجاناً.',
    metaDescription: 'طريقة تحميل فيديوهات إكس تويتر بجودة 1080p HD وحفظ الصور المتحركة بصيغة MP4 للهاتف والكمبيوتر مجاناً.',
    date: '21 أكتوبر 2026',
    coverImage: '/og-image.png',
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: '/og-image.png',
      url: '/ar/about',
    },
    tags: ['إكس', 'تويتر', 'فيديو 1080p', 'متحركات'],
  },
  {
    ...postPinterest,
    title: 'دليل تحميل فيديوهات وأفكار بنترست بجودة HD (2026)',
    metaTitle: 'دليل تحميل فيديوهات وأفكار بنترست بجودة HD (2026)',
    description: 'الدليل الشامل لتنزيل فيديوهات بنترست وأفكار Idea Pins والصور الأصلية عالية الدقة بدون علامات مائية على هاتفك أو حاسوبك.',
    metaDescription: 'الدليل الشامل لتنزيل فيديوهات بنترست وأفكار Idea Pins والصور الأصلية عالية الدقة بدون علامات مائية على هاتفك أو حاسوبك.',
    date: '05 أكتوبر 2026',
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: '/og-image.png',
      url: '/ar/about',
    },
    tags: ['بنترست', 'فيديو عالي الدقة', 'أفكار بنترست', 'شروحات'],
  },
  ...newBlogPosts.map((p) => ({
    ...p,
    author: {
      name: 'فريق GoSaveClip',
      role: 'فريق التحرير',
      avatar: p.author.avatar,
      url: '/ar/about',
    },
  })),
];

export function getAllPosts(lang: string = 'en'): BlogPost[] {
  return lang === 'ar' ? AR_BLOG_POSTS : BLOG_POSTS;
}

export function getPostBySlug(slug: string, lang: string = 'en'): BlogPost | undefined {
  const posts = lang === 'ar' ? AR_BLOG_POSTS : BLOG_POSTS;
  return posts.find((p) => p.slug === slug) || BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRecentPosts(count: number = 3, lang: string = 'en'): BlogPost[] {
  const posts = lang === 'ar' ? AR_BLOG_POSTS : BLOG_POSTS;
  return posts.slice(0, count);
}

export function getPostsByCategory(category: string, lang: string = 'en'): BlogPost[] {
  const posts = lang === 'ar' ? AR_BLOG_POSTS : BLOG_POSTS;
  if (category === 'All' || category === 'الكل') return posts;
  return posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
