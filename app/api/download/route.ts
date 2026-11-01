import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
  // 1. IP Rate Limiting (60 requests / minute)
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip, 60, 60 * 1000);
  if (!rateLimit.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many download requests. Please try again shortly.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimit.reset.toString(),
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'gosaveclip_media.mp4';

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', {
      status: 400,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return new NextResponse('Invalid protocol', {
        status: 400,
        headers: { 'X-Robots-Tag': 'noindex, nofollow' },
      });
    }

    const isPinterestDomain = /pinimg\.com|pinterest\.[a-z.]+/i.test(parsed.hostname);
    const isTikTokDomain = /tiktokcdn|tiktok/i.test(parsed.hostname);
    const isFacebookDomain = /fbcdn\.net|facebook\.com/i.test(parsed.hostname);
    const isInstagramDomain = /cdninstagram\.com|instagram\.com/i.test(parsed.hostname);
    const isXDomain = /twimg\.com|twitter\.com|x\.com/i.test(parsed.hostname);

    const requestHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: '*/*',
    };

    if (isPinterestDomain) {
      requestHeaders['Referer'] = 'https://www.pinterest.com/';
    } else if (isTikTokDomain) {
      requestHeaders['Referer'] = 'https://www.tiktok.com/';
    } else if (isFacebookDomain) {
      requestHeaders['Referer'] = 'https://www.facebook.com/';
    } else if (isInstagramDomain) {
      requestHeaders['Referer'] = 'https://www.instagram.com/';
    } else if (isXDomain) {
      requestHeaders['Referer'] = 'https://x.com/';
    }

    let upstreamResponse = await fetch(targetUrl, {
      headers: requestHeaders,
      redirect: 'follow',
    });

    // If initial fetch failed and we sent Referer, retry cleanly without Referer
    if (!upstreamResponse.ok && (isPinterestDomain || isTikTokDomain || isFacebookDomain || isInstagramDomain || isXDomain)) {
      upstreamResponse = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
        redirect: 'follow',
      });
    }

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      console.warn(`Upstream fetch returned ${upstreamResponse.status} for ${targetUrl}`);
      return NextResponse.redirect(targetUrl);
    }

    let contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';
    if (contentType.includes('text/html') || contentType.includes('application/xml')) {
      if (filename.endsWith('.mp4')) contentType = 'video/mp4';
      else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (filename.endsWith('.png')) contentType = 'image/png';
      else if (filename.endsWith('.gif')) contentType = 'image/gif';
      else if (filename.endsWith('.mp3')) contentType = 'audio/mpeg';
    }

    const contentLength = upstreamResponse.headers.get('content-length');
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');
    responseHeaders.set('Cache-Control', 'public, max-age=3600');
    responseHeaders.set('X-Robots-Tag', 'noindex, nofollow');

    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(upstreamResponse.body as any, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('Download proxy error:', err);
    return NextResponse.redirect(targetUrl);
  }
}
