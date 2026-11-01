const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate Favicon SVG (Rose gradient with download arrow and clip element)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Rounded Base Background -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  
  <!-- Subtle Inner Ring Highlight -->
  <rect x="24" y="24" width="464" height="464" rx="108" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="12"/>
  
  <!-- Download Arrow & Clip Base -->
  <g filter="url(#shadow)">
    <!-- Downward Arrow Shaft & Head -->
    <path d="M256 120 V290" stroke="#ffffff" stroke-width="44" stroke-linecap="round"/>
    <path d="M176 226 L256 306 L336 226" fill="none" stroke="#ffffff" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Bottom Clip Tray -->
    <path d="M148 340 H364" stroke="#ffffff" stroke-width="44" stroke-linecap="round"/>
    <circle cx="148" cy="340" r="14" fill="#ffffff"/>
    <circle cx="364" cy="340" r="14" fill="#ffffff"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

// 2. Generate OG Image (1200x630)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="roseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <radialGradient id="radial" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1200" height="630" fill="url(#radial)"/>
  
  <!-- Subtle grid pattern -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="400" x2="1200" y2="400"/>
    <line x1="0" y1="500" x2="1200" y2="500"/>
  </g>

  <!-- Logo Mark -->
  <g transform="translate(100, 140)">
    <rect width="96" height="96" rx="24" fill="url(#roseGlow)"/>
    <path d="M48 24 V58 M32 44 L48 60 L64 44 M26 70 H70" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Brand Title -->
  <text x="216" y="206" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="900" fill="#ffffff" letter-spacing="-1">
    GoSave<tspan fill="#f43f5e">Clip</tspan>
  </text>
  <text x="216" y="234" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">
    gosaveclip.online · Free Online Video &amp; Audio Downloader
  </text>

  <!-- Main Headline -->
  <text x="100" y="340" font-family="system-ui, sans-serif" font-size="46" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
    Download Social Videos &amp; Reels in Full HD 1080p
  </text>
  <text x="100" y="390" font-family="system-ui, sans-serif" font-size="24" font-weight="400" fill="#cbd5e1">
    Save watermark-free videos, high-res photos, and 320kbps MP3 audio from any device.
  </text>

  <!-- Badges for Platforms -->
  <g transform="translate(100, 460)">
    <!-- TikTok -->
    <rect x="0" y="0" width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="80" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">🎵 TikTok (No WM)</text>
    
    <!-- Instagram -->
    <rect x="180" y="0" width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="260" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">📷 Instagram Reels</text>
    
    <!-- Facebook -->
    <rect x="360" y="0" width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="440" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">📘 Facebook 1080p</text>
    
    <!-- Pinterest -->
    <rect x="540" y="0" width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="620" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">📌 Pinterest 4K</text>
    
    <!-- X (Twitter) -->
    <rect x="720" y="0" width="160" height="52" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="800" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f8fafc">🚀 X / Twitter MP4</text>
  </g>
</svg>`;

async function buildImages() {
  const svgBuffer = Buffer.from(iconSvg);

  // Generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate favicon-32x32
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Generate favicon-16x16
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Generate favicon.ico (using 48x48 PNG container supported by all modern browsers)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // Generate og-image.png (1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Successfully generated all icon and OG assets in /public');
}

buildImages().catch(console.error);
