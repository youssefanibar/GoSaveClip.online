export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://gosaveclip.online').replace(/\/$/, '');
export const SITE_NAME = 'GoSaveClip';
export const SITE_DOMAIN = 'gosaveclip.online';
export const BRAND_TAGLINE = 'Free Online Video & Audio Downloader';

export const SUPPORTED_PLATFORMS = [
  'TikTok',
  'Instagram',
  'Facebook',
  'Pinterest',
  'X (Twitter)',
] as const;

export const SUPPORTED_HOSTNAMES = [
  'tiktok.com',
  'vm.tiktok.com',
  'vt.tiktok.com',
  'v.douyin.com',
  'instagram.com',
  'instagr.am',
  'facebook.com',
  'fb.watch',
  'fb.com',
  'm.facebook.com',
  'web.facebook.com',
  'pinterest.com',
  'pin.it',
  'twitter.com',
  'x.com',
  't.co',
];

export function isSupportedUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    return SUPPORTED_HOSTNAMES.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}
