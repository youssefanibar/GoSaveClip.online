export interface ToolConfig {
  slug: string;
  platform: 'tiktok' | 'instagram' | 'facebook' | 'pinterest' | 'x';
  mediaType: 'video' | 'audio' | 'story' | 'all';
  icon: string;
  popularSampleUrl: string;
  sampleBadge: string;
  relatedToolSlugs: string[];
  relatedBlogSlugs: string[];
}

export const TOOL_SLUGS = [
  'tiktok-video-downloader',
  'tiktok-mp3-downloader',
  'instagram-reels-downloader',
  'instagram-story-downloader',
  'facebook-video-downloader',
  'pinterest-video-downloader',
  'x-video-downloader',
] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

export const TOOLS: Record<ToolSlug, ToolConfig> = {
  'tiktok-video-downloader': {
    slug: 'tiktok-video-downloader',
    platform: 'tiktok',
    mediaType: 'video',
    icon: 'Music2',
    popularSampleUrl: 'https://www.tiktok.com/@voyageur/video/7289123849120491823',
    sampleBadge: 'Watermark-Free (up to 1080p)',
    relatedToolSlugs: ['tiktok-mp3-downloader', 'instagram-reels-downloader', 'facebook-video-downloader'],
    relatedBlogSlugs: ['how-to-download-tiktok-videos-without-watermark'],
  },
  'tiktok-mp3-downloader': {
    slug: 'tiktok-mp3-downloader',
    platform: 'tiktok',
    mediaType: 'audio',
    icon: 'Headphones',
    popularSampleUrl: 'https://www.tiktok.com/@voyageur/video/7289123849120491823',
    sampleBadge: 'High-Quality MP3',
    relatedToolSlugs: ['tiktok-video-downloader', 'instagram-reels-downloader'],
    relatedBlogSlugs: ['how-to-download-tiktok-videos-without-watermark'],
  },
  'instagram-reels-downloader': {
    slug: 'instagram-reels-downloader',
    platform: 'instagram',
    mediaType: 'video',
    icon: 'Instagram',
    popularSampleUrl: 'https://www.instagram.com/reel/C8qK9lmOP12/',
    sampleBadge: 'Audio (source quality)',
    relatedToolSlugs: ['instagram-story-downloader', 'tiktok-video-downloader', 'facebook-video-downloader'],
    relatedBlogSlugs: ['save-instagram-reels-with-audio-to-camera-roll'],
  },
  'instagram-story-downloader': {
    slug: 'instagram-story-downloader',
    platform: 'instagram',
    mediaType: 'story',
    icon: 'Camera',
    popularSampleUrl: 'https://www.instagram.com/reel/C8qK9lmOP12/',
    sampleBadge: 'Up to 1080p (source quality)',
    relatedToolSlugs: ['instagram-reels-downloader', 'facebook-video-downloader'],
    relatedBlogSlugs: ['save-instagram-reels-with-audio-to-camera-roll'],
  },
  'facebook-video-downloader': {
    slug: 'facebook-video-downloader',
    platform: 'facebook',
    mediaType: 'video',
    icon: 'Facebook',
    popularSampleUrl: 'https://www.facebook.com/watch/?v=98127391823719',
    sampleBadge: 'Up to 1080p',
    relatedToolSlugs: ['instagram-reels-downloader', 'tiktok-video-downloader'],
    relatedBlogSlugs: ['download-facebook-videos-in-1080p-full-hd'],
  },
  'pinterest-video-downloader': {
    slug: 'pinterest-video-downloader',
    platform: 'pinterest',
    mediaType: 'all',
    icon: 'Pin',
    popularSampleUrl: 'https://www.pinterest.com/pin/1089308472398572111/',
    sampleBadge: 'Up to 1080p (source quality)',
    relatedToolSlugs: ['tiktok-video-downloader', 'instagram-reels-downloader'],
    relatedBlogSlugs: ['the-ultimate-pinterest-video-downloader-guide'],
  },
  'x-video-downloader': {
    slug: 'x-video-downloader',
    platform: 'x',
    mediaType: 'video',
    icon: 'Twitter',
    popularSampleUrl: 'https://x.com/SpaceX/status/1780650965727961234',
    sampleBadge: 'Up to 60fps MP4',
    relatedToolSlugs: ['facebook-video-downloader', 'tiktok-video-downloader'],
    relatedBlogSlugs: ['how-to-download-x-twitter-videos-1080p-hd'],
  },
};

export function isValidToolSlug(slug: string): slug is ToolSlug {
  return (TOOL_SLUGS as readonly string[]).includes(slug);
}
