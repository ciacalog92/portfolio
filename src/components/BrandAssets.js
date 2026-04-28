import React, { useRef, useEffect, useState } from 'react';

const BRAND = {
  name: 'CLINICA IPHONE',
  sub: 'by IGroup',
  primary: '#0A84FF',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  gradient: ['#0A84FF', '#30D158'],
};

const ICON_SIZES = [
  // Favicon
  { label: 'Favicon 16×16',        size: 16,   icon: true },
  { label: 'Favicon 32×32',        size: 32,   icon: true },
  { label: 'Favicon 48×48',        size: 48,   icon: true },
  { label: 'Favicon 64×64',        size: 64,   icon: true },
  { label: 'Favicon 96×96',        size: 96,   icon: true },
  { label: 'Favicon 128×128',      size: 128,  icon: true },
  { label: 'Favicon 256×256',      size: 256,  icon: true },
  // iOS / iPadOS
  { label: 'iOS Touch 57×57',      size: 57,   icon: true },
  { label: 'iOS Touch 60×60',      size: 60,   icon: true },
  { label: 'iOS Touch 76×76',      size: 76,   icon: true },
  { label: 'iOS Touch 114×114',    size: 114,  icon: true },
  { label: 'iOS Touch 120×120',    size: 120,  icon: true },
  { label: 'iOS iPad 152×152',     size: 152,  icon: true },
  { label: 'iOS iPad Pro 167×167', size: 167,  icon: true },
  { label: 'iOS Touch 180×180',    size: 180,  icon: true },
  // Android / PWA
  { label: 'Android 36×36',        size: 36,   icon: true },
  { label: 'Android 48×48',        size: 48,   icon: true },
  { label: 'Android 72×72',        size: 72,   icon: true },
  { label: 'Android 96×96',        size: 96,   icon: true },
  { label: 'Android 144×144',      size: 144,  icon: true },
  { label: 'Android 192×192',      size: 192,  icon: true },
  { label: 'Android 256×256',      size: 256,  icon: true },
  { label: 'Android 384×384',      size: 384,  icon: true },
  { label: 'Android 512×512',      size: 512,  icon: true },
  // macOS
  { label: 'macOS 512×512',        size: 512,  icon: true },
  { label: 'macOS 1024×1024',      size: 1024, icon: true },
  // Windows / Metro
  { label: 'Windows Tile 70×70',   size: 70,   icon: true },
  { label: 'Windows Tile 150×150', size: 150,  icon: true },
  { label: 'Windows Tile 310×310', size: 310,  icon: true },
  // Social / OG
  { label: 'OG Image 1200×630',    size: null, w: 1200, h: 630, icon: false },
  { label: 'Twitter Card 800×418', size: null, w: 800,  h: 418, icon: false },
  { label: 'LinkedIn 1200×627',    size: null, w: 1200, h: 627, icon: false },
];

function renderIconToCanvas(canvas, size) {
  const dpr = 1;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const r = size * 0.22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, BRAND.gradient[0]);
  grad.addColorStop(1, BRAND.gradient[1]);
  ctx.fillStyle = grad;
  ctx.fill();

  // Phone icon
  const pw = size * 0.38;
  const ph = size * 0.60;
  const px = (size - pw) / 2;
  const py = (size - ph) / 2;
  const pr = pw * 0.18;

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.moveTo(px + pr, py);
  ctx.lineTo(px + pw - pr, py);
  ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr);
  ctx.lineTo(px + pw, py + ph - pr);
  ctx.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
  ctx.lineTo(px + pr, py + ph);
  ctx.quadraticCurveTo(px, py + ph, px, py + ph - pr);
  ctx.lineTo(px, py + pr);
  ctx.quadraticCurveTo(px, py, px + pr, py);
  ctx.closePath();
  ctx.fill();

  // Screen
  const sm = pw * 0.1;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.rect(px + sm, py + sm * 2.2, pw - sm * 2, ph - sm * 4.4);
  ctx.fill();

  // Home pill
  if (size >= 48) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.ellipse(px + pw / 2, py + ph - sm * 1.1, pw * 0.12, sm * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderBannerToCanvas(canvas, w, h) {
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, BRAND.dark);
  grad.addColorStop(1, '#2C2C2E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Accent stripe
  const stripe = ctx.createLinearGradient(0, 0, w * 0.5, 0);
  stripe.addColorStop(0, BRAND.gradient[0] + '33');
  stripe.addColorStop(1, 'transparent');
  ctx.fillStyle = stripe;
  ctx.fillRect(0, 0, w * 0.5, h);

  // Logo circle
  const iconSz = Math.min(h * 0.52, 160);
  const iconX  = w * 0.08;
  const iconY  = (h - iconSz) / 2;
  const tmp    = document.createElement('canvas');
  renderIconToCanvas(tmp, iconSz);
  ctx.drawImage(tmp, iconX, iconY, iconSz, iconSz);

  const textX = iconX + iconSz + h * 0.08;

  ctx.fillStyle = BRAND.white;
  const titleSize = Math.round(h * 0.24);
  ctx.font       = `700 ${titleSize}px -apple-system, SF Pro Display, Helvetica Neue, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(BRAND.name, textX, h * 0.42);

  ctx.fillStyle = BRAND.primary;
  const subSize = Math.round(h * 0.14);
  ctx.font      = `500 ${subSize}px -apple-system, SF Pro Text, Helvetica Neue, sans-serif`;
  ctx.fillText(BRAND.sub, textX, h * 0.65);
}

function IconPreview({ entry }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (entry.icon) {
      renderIconToCanvas(canvas, entry.size);
    } else {
      renderBannerToCanvas(canvas, entry.w, entry.h);
    }
  }, [entry]);

  const displayW = entry.icon ? Math.min(entry.size, 96) : Math.min(entry.w / 4, 300);
  const displayH = entry.icon ? Math.min(entry.size, 96) : Math.round(displayW * (entry.h / entry.w));

  function download() {
    const canvas = canvasRef.current;
    const link   = document.createElement('a');
    const slug   = entry.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `clinica-iphone-${slug}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div style={styles.card}>
      <div style={styles.previewBox}>
        <canvas
          ref={canvasRef}
          style={{ width: displayW, height: displayH, imageRendering: 'pixelated', borderRadius: entry.icon ? 4 : 6 }}
        />
      </div>
      <div style={styles.cardInfo}>
        <span style={styles.cardLabel}>{entry.label}</span>
        <span style={styles.cardDim}>{entry.icon ? `${entry.size}×${entry.size}` : `${entry.w}×${entry.h}`}</span>
      </div>
      <button onClick={download} style={styles.dlBtn}>↓ PNG</button>
    </div>
  );
}

export default function BrandAssets() {
  const [filter, setFilter] = useState('all');

  const groups = [
    { key: 'all',     label: 'Tutti' },
    { key: 'favicon', label: 'Favicon' },
    { key: 'ios',     label: 'iOS / iPadOS' },
    { key: 'android', label: 'Android / PWA' },
    { key: 'macos',   label: 'macOS' },
    { key: 'windows', label: 'Windows' },
    { key: 'social',  label: 'Social / OG' },
  ];

  const filtered = ICON_SIZES.filter(e => {
    if (filter === 'all')     return true;
    if (filter === 'favicon') return e.label.toLowerCase().startsWith('favicon');
    if (filter === 'ios')     return e.label.toLowerCase().startsWith('ios');
    if (filter === 'android') return e.label.toLowerCase().startsWith('android');
    if (filter === 'macos')   return e.label.toLowerCase().startsWith('macos');
    if (filter === 'windows') return e.label.toLowerCase().startsWith('windows');
    if (filter === 'social')  return !e.icon;
    return true;
  });

  function downloadAll() {
    ICON_SIZES.forEach((entry, i) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        if (entry.icon) renderIconToCanvas(canvas, entry.size);
        else renderBannerToCanvas(canvas, entry.w, entry.h);
        const link   = document.createElement('a');
        const slug   = entry.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        link.download = `clinica-iphone-${slug}.png`;
        link.href     = canvas.toDataURL('image/png');
        link.click();
      }, i * 120);
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Brand Assets</h1>
          <p style={styles.subtitle}>CLINICA IPHONE · by IGroup — {ICON_SIZES.length} formati</p>
        </div>
        <button onClick={downloadAll} style={styles.dlAllBtn}>↓ Scarica tutti</button>
      </div>

      <div style={styles.filters}>
        {groups.map(g => (
          <button
            key={g.key}
            onClick={() => setFilter(g.key)}
            style={{ ...styles.filterBtn, ...(filter === g.key ? styles.filterActive : {}) }}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div style={styles.metaBox}>
        <p style={styles.metaTitle}>HTML &lt;head&gt; meta tags</p>
        <pre style={styles.metaPre}>{META_TAGS}</pre>
      </div>

      <div style={styles.grid}>
        {filtered.map((entry, i) => (
          <IconPreview key={i} entry={entry} />
        ))}
      </div>
    </div>
  );
}

const META_TAGS = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="16x16"   href="/icons/clinica-iphone-favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32"   href="/icons/clinica-iphone-favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48"   href="/icons/clinica-iphone-favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64"   href="/icons/clinica-iphone-favicon-64x64.png">
<link rel="icon" type="image/png" sizes="96x96"   href="/icons/clinica-iphone-favicon-96x96.png">
<link rel="icon" type="image/png" sizes="128x128" href="/icons/clinica-iphone-favicon-128x128.png">
<link rel="icon" type="image/png" sizes="256x256" href="/icons/clinica-iphone-favicon-256x256.png">

<!-- iOS / iPadOS -->
<link rel="apple-touch-icon" sizes="57x57"   href="/icons/clinica-iphone-ios-touch-57x57.png">
<link rel="apple-touch-icon" sizes="60x60"   href="/icons/clinica-iphone-ios-touch-60x60.png">
<link rel="apple-touch-icon" sizes="76x76"   href="/icons/clinica-iphone-ios-touch-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="/icons/clinica-iphone-ios-touch-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="/icons/clinica-iphone-ios-touch-120x120.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/clinica-iphone-ios-ipad-152x152.png">
<link rel="apple-touch-icon" sizes="167x167" href="/icons/clinica-iphone-ios-ipad-pro-167x167.png">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/clinica-iphone-ios-touch-180x180.png">

<!-- Android / PWA -->
<link rel="icon" type="image/png" sizes="192x192" href="/icons/clinica-iphone-android-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icons/clinica-iphone-android-512x512.png">

<!-- Windows Tile -->
<meta name="msapplication-TileImage"  content="/icons/clinica-iphone-windows-tile-150x150.png">
<meta name="msapplication-TileColor"  content="#0A84FF">
<meta name="msapplication-square70x70logo"   content="/icons/clinica-iphone-windows-tile-70x70.png">
<meta name="msapplication-square150x150logo" content="/icons/clinica-iphone-windows-tile-150x150.png">
<meta name="msapplication-square310x310logo" content="/icons/clinica-iphone-windows-tile-310x310.png">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0A84FF">

<!-- Social / OG -->
<meta property="og:image"         content="/icons/clinica-iphone-og-image-1200x630.png">
<meta property="og:image:width"   content="1200">
<meta property="og:image:height"  content="630">
<meta name="twitter:card"         content="summary_large_image">
<meta name="twitter:image"        content="/icons/clinica-iphone-twitter-card-800x418.png">`;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F2F2F7',
    fontFamily: '-apple-system, SF Pro Text, Helvetica Neue, sans-serif',
    padding: '32px 24px 64px',
    color: '#1C1C1E',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 14,
    color: '#6e6e73',
    margin: '4px 0 0',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid #D1D1D6',
    background: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    color: '#1C1C1E',
    transition: 'all .15s',
  },
  filterActive: {
    background: '#0A84FF',
    borderColor: '#0A84FF',
    color: '#fff',
  },
  metaBox: {
    background: '#1C1C1E',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 28,
  },
  metaTitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    margin: '0 0 10px',
  },
  metaPre: {
    color: '#30D158',
    fontSize: 11,
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    fontFamily: 'SF Mono, Menlo, Monaco, Courier New, monospace',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '16px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,.08)',
  },
  previewBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1C1C1E',
  },
  cardDim: {
    fontSize: 11,
    color: '#8E8E93',
  },
  dlBtn: {
    width: '100%',
    padding: '7px 0',
    borderRadius: 8,
    border: 'none',
    background: '#F2F2F7',
    color: '#0A84FF',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  dlAllBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    border: 'none',
    background: '#0A84FF',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
