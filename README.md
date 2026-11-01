# GoSaveClip – Free Online Video & Audio Downloader

GoSaveClip (`gosaveclip.online`) is a high-performance web utility built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It enables users to download high-resolution videos, reels, stories, photos, and MP3 audio from **TikTok** (watermark-free), **Instagram**, **Facebook**, **Pinterest**, and **X (Twitter)** in Full HD 1080p without watermarks or software installation.

---

## 🌟 Key Features

- **Full Multi-Platform Support**: Dedicated tools for TikTok Video (no watermark), TikTok MP3 (320kbps), Instagram Reels, Instagram Stories, Facebook Watch, Pinterest (4K / original), and X (Twitter 1080p & GIFs).
- **Server-Side Rendering (SSR)**: Complete initial HTML rendering for all tools, blogs, and legal pages with zero client-only SPA reliance.
- **Full Internationalization (i18n)**: English (`/en`) and Arabic (`/ar`) with native `dir="rtl"` support, self-hosted Arabic font (`Cairo`), and automatic language-aware canonical and `hreflang` tags.
- **Enterprise SEO & Structured Data**: Rich JSON-LD schemas (`WebSite`, `Organization`, `WebApplication`, `FAQPage`, `BreadcrumbList`, `Article`), dynamic `sitemap.xml`, and clean `robots.txt`.
- **Security & Privacy**: IP sliding-window rate limiting, domain validation whitelist, 256-bit SSL encryption proxy, and zero persistent storage of downloaded media files.

---

## ⚙️ Configuration & Environment Variables

Create a `.env.local` file or configure your production environment variables:

```bash
# Canonical site URL (single source of truth for canonicals, sitemap, hreflang, OG tags)
NEXT_PUBLIC_SITE_URL="https://gosaveclip.online"

# Optional: Google Search Console verification token
NEXT_PUBLIC_GSC_VERIFICATION="your-gsc-verification-token"

# Optional: Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"

# Optional: Server-side Gemini API key (if AI capabilities are enabled)
GEMINI_API_KEY=""
```

### Setting `NEXT_PUBLIC_SITE_URL`

The `NEXT_PUBLIC_SITE_URL` environment variable controls all canonical links, sitemaps, OpenGraph image absolute URLs, and structured data metadata across the application.
- In production, set it to `https://gosaveclip.online`.
- In staging or local environments, set it to your staging or preview domain. If omitted, it defaults safely to `https://gosaveclip.online`.

---

## 🌐 How to Add a New Language

Adding a new language to GoSaveClip requires exactly **two steps**: **ONE translation file** + **ONE config entry**.

### Step 1: Add the language to the config (`lib/i18n/config.ts`)

Open `lib/i18n/config.ts` and add your new locale code to the `locales` array and `localeConfig` map:

```typescript
export const locales = ['en', 'ar', 'es'] as const; // Added 'es'
export type Locale = (typeof locales)[number];

export const localeConfig: Record<Locale, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' }, // New entry
};
```

### Step 2: Create the dictionary JSON file (`lib/i18n/dictionaries/<lang>.json`)

Copy `lib/i18n/dictionaries/en.json` to `lib/i18n/dictionaries/es.json` and translate the string values:

```bash
cp lib/i18n/dictionaries/en.json lib/i18n/dictionaries/es.json
```

That's it! Next.js will automatically:
- Generate static routes for `/es`, `/es/[tool]`, `/es/blog`, etc.
- Include Spanish URLs in `sitemap.xml` with bidirectional `hreflang` alternates.
- Add the language to the language switcher dropdown in the header and footer.

---

## 🚀 How to Deploy to Google Cloud Run

GoSaveClip is pre-configured with `output: 'standalone'` in `next.config.ts` and includes a production-ready, multi-stage `Dockerfile`.

### 1. Build and Test Locally with Docker

```bash
# Build the Docker container image
docker build -t gosaveclip .

# Run the container locally (mapped to port 8080)
docker run -p 8080:8080 -e PORT=8080 -e HOSTNAME=0.0.0.0 gosaveclip
```

Test the health endpoint:
```bash
curl http://localhost:8080/api/health
# Returns: {"status":"healthy","service":"GoSaveClip","timestamp":"..."}
```

### 2. Deploy to Google Cloud Run

Run the following commands using the Google Cloud CLI (`gcloud`):

```bash
# 1. Set your GCP Project ID
export PROJECT_ID="your-google-cloud-project-id"
export REGION="us-central1"
export SERVICE_NAME="gosaveclip"

# 2. Build and submit container image via Cloud Build
gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest

# 3. Deploy to Cloud Run
gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NEXT_PUBLIC_SITE_URL="https://gosaveclip.online" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1
```

---

## 🔒 Security & Best Practices

- **Strict Domain Whitelisting**: `/api/extract` only accepts verified links from TikTok (`tiktok.com`), Instagram (`instagram.com`), Facebook (`facebook.com`), Pinterest (`pinterest.com`, `pin.it`), and X (`x.com`, `twitter.com`, `t.co`).
- **IP Rate Limiting**: In-memory sliding-window limiter prevents abuse and scraper floods.
- **Privacy First**: Zero video storage on origin servers; media is proxied transiently directly to user devices.
