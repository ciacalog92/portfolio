import React, { useState } from 'react';
import { modelColors, modelSpecs, modelImageUrl } from '../data/iphones';

/* ── Lens helper ── */
function Lens({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r}       fill="#2a2a2e" />
      <circle cx={cx} cy={cy} r={r * .82} fill="#141418" />
      <circle cx={cx} cy={cy} r={r * .62} fill="#08080c" />
      <circle cx={cx} cy={cy} r={r * .4}  fill="#000" />
      {/* blue-purple tint */}
      <circle cx={cx + r*.22} cy={cy + r*.18} r={r*.22} fill="rgba(80,120,220,.45)" />
      {/* highlight arc top-left */}
      <circle cx={cx - r*.28} cy={cy - r*.28} r={r*.16} fill="rgba(255,255,255,.3)" />
    </g>
  );
}

/* ── Flash helper ── */
function Flash({ cx, cy, r = 10 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r}      fill="#1c1c1e" />
      <circle cx={cx} cy={cy} r={r * .6} fill="#2a2000" />
      <circle cx={cx} cy={cy} r={r * .4} fill="#ffd000" opacity=".75" />
    </g>
  );
}

/* ── Back-view SVG render ── */
function PhoneBackSVG({ model, colorHex }) {
  const fill = colorHex || '#d1d1d6';
  const uid  = `bk${model.replace(/\W/g, '').slice(-10)}`;

  const isSE  = model.includes('SE');
  const isPro = model.includes('Pro');
  const num   = parseInt(model.match(/iPhone (\d+)/)?.[1] || '0');

  // Camera configuration
  let cam;
  if (isSE)                    cam = model.includes('2020') ? 'se20' : 'se22';
  else if (num === 17 && isPro) cam = 'bar_pro';
  else if (num === 17)          cam = 'bar_std';
  else if (isPro)               cam = 'triple';
  else if (num >= 14)           cam = 'dual_v';
  else                          cam = 'dual_d';

  // Darker tint for bump
  const rr = parseInt(fill.slice(1, 3), 16) || 180;
  const gg = parseInt(fill.slice(3, 5), 16) || 180;
  const bb = parseInt(fill.slice(5, 7), 16) || 180;
  const lum = (0.299 * rr + 0.587 * gg + 0.114 * bb) / 255;
  const isLight = lum > 0.55;
  const bumpFill = `rgb(${Math.max(0,rr-26)},${Math.max(0,gg-26)},${Math.max(0,bb-26)})`;
  const logoColor = isLight ? 'rgba(0,0,0,.32)' : 'rgba(255,255,255,.42)';

  // Bump geometry
  const bumps = {
    triple:   { x: 22, y: 14, w: 132, h: 132, rx: 28 },
    dual_v:   { x: 22, y: 14, w: 110, h: 120, rx: 24 },
    dual_d:   { x: 22, y: 14, w: 112, h: 112, rx: 24 },
    se22:     { x: 30, y: 18, w:  86, h:  86, rx: 20 },
    bar_pro:  { x: 16, y: 14, w: 268, h:  76, rx: 34 },
    bar_std:  { x: 16, y: 14, w: 268, h:  68, rx: 30 },
  };

  const bump = bumps[cam];

  // Camera lenses inside bump
  function renderLenses() {
    switch (cam) {
      case 'triple':
        return <>
          <Lens cx={70}  cy={58}  r={24} />   {/* wide */}
          <Lens cx={110} cy={47}  r={21} />   {/* tele */}
          <Lens cx={84}  cy={96}  r={21} />   {/* ultra-wide */}
          <Flash cx={118} cy={97} r={10} />
          <circle cx={104} cy={115} r={6} fill="#200830" />{/* LiDAR */}
          <circle cx={104} cy={115} r={3.5} fill="#3a1060" opacity=".8" />
        </>;
      case 'dual_v':
        return <>
          <Lens cx={72} cy={55}  r={22} />    {/* wide */}
          <Lens cx={72} cy={94}  r={20} />    {/* ultra-wide */}
          <Flash cx={100} cy={74} r={10} />
        </>;
      case 'dual_d':
        return <>
          <Lens cx={84}  cy={48} r={22} />    {/* wide */}
          <Lens cx={55}  cy={82} r={20} />    {/* ultra-wide */}
          <Flash cx={92} cy={86} r={10} />
        </>;
      case 'se22':
        return <>
          <Lens cx={73} cy={69} r={28} />
          <Flash cx={105} cy={48} r={9} />
        </>;
      case 'se20':
        return <Lens cx={150} cy={72} r={36} />;
      case 'bar_pro':
        return <>
          <Lens cx={66}  cy={52} r={24} />    {/* wide */}
          <Lens cx={120} cy={52} r={22} />    {/* tele */}
          <Lens cx={93}  cy={52} r={18} />    {/* ultra-wide (small, between) */}
          <Flash cx={175} cy={42} r={11} />
          <circle cx={175} cy={62} r={6}   fill="#200830" />
          <circle cx={175} cy={62} r={3.5} fill="#3a1060" opacity=".8" />
        </>;
      case 'bar_std':
        return <>
          <Lens cx={70}  cy={48} r={22} />    {/* wide */}
          <Lens cx={120} cy={48} r={20} />    {/* ultra-wide */}
          <Flash cx={165} cy={48} r={10} />
        </>;
      default: return null;
    }
  }

  // Apple logo path (Material Design reference, 24×24 units)
  // Centered at (150, 300) via translate(102, 252) scale(4)
  const applePath = "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";

  return (
    <svg
      viewBox="0 0 300 600"
      width="88"
      height="176"
      style={{ display: 'block', filter: 'drop-shadow(0 10px 28px rgba(0,0,0,.30))' }}
      aria-hidden="true"
    >
      <defs>
        {/* Body gloss */}
        <linearGradient id={`${uid}bd`} x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,.28)" />
          <stop offset="45%"  stopColor="rgba(255,255,255,.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.22)" />
        </linearGradient>
        {/* Left edge highlight */}
        <linearGradient id={`${uid}el`} x1="0" y1=".5" x2="1" y2=".5">
          <stop offset="0%"   stopColor="rgba(255,255,255,.50)" />
          <stop offset="8%"   stopColor="rgba(255,255,255,.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* Right edge shadow */}
        <linearGradient id={`${uid}er`} x1="0" y1=".5" x2="1" y2=".5">
          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
          <stop offset="88%"  stopColor="rgba(0,0,0,.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.26)" />
        </linearGradient>
        {/* Bump gloss */}
        <linearGradient id={`${uid}bp`} x1=".2" y1=".2" x2=".8" y2=".8">
          <stop offset="0%"   stopColor="rgba(255,255,255,.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.16)" />
        </linearGradient>
      </defs>

      {/* ── Side buttons ── */}
      {/* Action button */}
      <rect x="1" y="68"  width="11" height="28" rx="5" fill={fill} stroke="rgba(0,0,0,.28)" strokeWidth="1.5" />
      {/* Vol up */}
      <rect x="1" y="108" width="11" height="48" rx="5" fill={fill} stroke="rgba(0,0,0,.28)" strokeWidth="1.5" />
      {/* Vol down */}
      <rect x="1" y="166" width="11" height="48" rx="5" fill={fill} stroke="rgba(0,0,0,.28)" strokeWidth="1.5" />
      {/* Power */}
      <rect x="288" y="132" width="11" height="58" rx="5" fill={fill} stroke="rgba(0,0,0,.28)" strokeWidth="1.5" />

      {/* ── Phone body ── */}
      <rect x="12" y="8"  width="276" height="584" rx="66" fill={fill} />
      <rect x="12" y="8"  width="276" height="584" rx="66" fill={`url(#${uid}bd)`} />
      <rect x="12" y="8"  width="276" height="584" rx="66" fill={`url(#${uid}el)`} />
      <rect x="12" y="8"  width="276" height="584" rx="66" fill={`url(#${uid}er)`} />
      {/* Outer edge ring */}
      <rect x="12" y="8"  width="276" height="584" rx="66" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2.5" />
      <rect x="13" y="9"  width="274" height="582" rx="65" fill="none" stroke="rgba(0,0,0,.30)"       strokeWidth="1.2" />

      {/* ── Camera bump ── */}
      {bump && (
        <>
          <rect x={bump.x} y={bump.y} width={bump.w} height={bump.h} rx={bump.rx}
                fill={bumpFill} />
          <rect x={bump.x} y={bump.y} width={bump.w} height={bump.h} rx={bump.rx}
                fill={`url(#${uid}bp)`} />
          <rect x={bump.x} y={bump.y} width={bump.w} height={bump.h} rx={bump.rx}
                fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="1.2" />
        </>
      )}

      {/* ── Camera lenses ── */}
      {renderLenses()}

      {/* ── Apple logo ── */}
      <g transform="translate(102, 252) scale(4)" fill={logoColor}>
        <path d={applePath} />
      </g>

      {/* ── Bottom port ── */}
      <rect x="126" y="577" width="48" height="12" rx="6" fill="rgba(0,0,0,.16)" />
      <circle cx="104" cy="583" r="4"  fill="rgba(0,0,0,.14)" />
      <circle cx="196" cy="583" r="4"  fill="rgba(0,0,0,.14)" />
      <circle cx="90"  cy="583" r="2.5" fill="rgba(0,0,0,.10)" />
      <circle cx="210" cy="583" r="2.5" fill="rgba(0,0,0,.10)" />
    </svg>
  );
}

/* ── Phone preview: SVG back render + optional real-photo overlay ── */
function PhonePreview({ model, colorHex }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="pc2-phone-wrap" style={{ width: 88, height: 176 }}>
      <PhoneBackSVG model={model} colorHex={colorHex} />
      <img
        src={modelImageUrl(model)}
        alt={model}
        className={`pc2-phone-photo${imgLoaded ? ' loaded' : ''}`}
        onLoad={() => setImgLoaded(true)}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}

export default function ProductCard({ group, onAdd }) {
  const { model, availability, isNew, variants } = group;
  const colors = modelColors[model] || [];
  const specs  = modelSpecs[model]  || null;
  const defaultColor = colors.find(c => c.preferred)?.name || colors[0]?.name || null;

  const [selectedStorageIdx, setSelectedStorageIdx] = useState(null);
  const [selectedColors, setSelectedColors] = useState(
    () => defaultColor ? new Set([defaultColor]) : new Set()
  );
  const [preferredColor, setPreferredColor] = useState(defaultColor);

  const currentVariant = selectedStorageIdx !== null ? variants[selectedStorageIdx] : null;
  const isOnRequest    = availability === 'on-request';
  const accentHex      =
    (preferredColor && colors.find(c => c.name === preferredColor)?.hex) ||
    colors[0]?.hex || '#0071e3';

  function handleSwatchClick(colorName) {
    const isSelected  = selectedColors.has(colorName);
    const isPreferred = preferredColor === colorName;

    if (!isSelected) {
      if (selectedColors.size >= 3) return;
      const next = new Set(selectedColors).add(colorName);
      setSelectedColors(next);
      if (!preferredColor) setPreferredColor(colorName);
    } else if (!isPreferred) {
      setPreferredColor(colorName);
    } else {
      const next = new Set(selectedColors);
      next.delete(colorName);
      setSelectedColors(next);
      const remaining = [...next];
      setPreferredColor(remaining.length > 0 ? remaining[0] : null);
    }
  }

  function handleAdd() {
    if (!currentVariant || selectedColors.size === 0 || !preferredColor) return;
    onAdd({ ...currentVariant, colors: [...selectedColors], preferredColor });
  }

  const canAdd = !!(currentVariant && selectedColors.size > 0 && preferredColor);
  const btnText = !currentVariant
    ? 'Seleziona la memoria'
    : !canAdd
    ? 'Seleziona almeno un colore'
    : `Aggiungi al carrello — €${currentVariant.price}`;

  return (
    <div
      className={`product-card2${isOnRequest ? ' on-request' : ''}`}
      style={{ '--card-accent': accentHex }}
    >
      <div className="pc2-header">
        <div className="pc2-phone">
          <PhonePreview model={model} colorHex={accentHex} />
        </div>
        <div className="pc2-header-info">
          <div className="pc2-title-row">
            <span className="pc2-model">{model}</span>
            <div className="pc2-badges">
              {isNew       && <span className="badge badge-new">NUOVO</span>}
              {isOnRequest && <span className="badge badge-request">⚠ Previa disp.</span>}
            </div>
          </div>
          {specs && (
            <>
              <div className="pc2-specs">
                <span className="pc2-spec" title="Display">📱 {specs.display}</span>
                <span className="pc2-spec" title="Chip">⚡ {specs.chip}</span>
                <span className="pc2-spec" title="Fotocamera">📷 {specs.rearCam}</span>
              </div>
              <div className="pc2-specs">
                <span className="pc2-spec" title="Batteria">🔋 {specs.battery}</span>
                <span className="pc2-spec" title="Connettore">🔌 {specs.connector}</span>
                <span className="pc2-spec">{specs.biometric === 'Face ID' ? '😀' : '👆'} {specs.biometric}</span>
                {specs.fiveG       && <span className="pc2-spec pc2-spec-on">5G</span>}
                {specs.promotion   && <span className="pc2-spec pc2-spec-on">ProMotion 120Hz</span>}
                {specs.intelligence && <span className="pc2-spec pc2-spec-on">Apple Intelligence</span>}
                <span className="pc2-spec">📅 {specs.year}</span>
              </div>
            </>
          )}
          {isOnRequest && !isNew && (
            <p className="on-request-note" style={{ marginTop: 6, marginBottom: 0 }}>
              Contattare Daniele per disponibilità
            </p>
          )}
          {isNew && (
            <p className="on-request-note new-note" style={{ marginTop: 6, marginBottom: 0 }}>
              Prezzo prodotto NUOVO
            </p>
          )}
        </div>
      </div>

      {colors.length > 0 && (
        <div className="pc2-color-section">
          <div className="pc2-color-header">
            <span className="pc2-section-title">Colore ({selectedColors.size}/3)</span>
            <span className="pc2-color-hint">1× seleziona · 2× preferito ★</span>
          </div>
          <div className="pc2-swatches">
            {colors.map(c => {
              const isSel   = selectedColors.has(c.name);
              const isPref  = preferredColor === c.name;
              const isDisab = !isSel && selectedColors.size >= 3;
              return (
                <button
                  key={c.name}
                  className={`pc2-swatch${isSel ? ' selected' : ''}${isPref ? ' preferred' : ''}${isDisab ? ' disabled' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => !isDisab && handleSwatchClick(c.name)}
                  title={`${c.name}${isPref ? ' ★ Preferito' : isSel ? ' ✓ Selezionato' : ''}`}
                >
                  {(isSel || isPref) && (
                    <span className="swatch-icon">{isPref ? '★' : '✓'}</span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedColors.size > 0 && (
            <div className="pc2-selected-colors">
              {[...selectedColors].map(name => (
                <span key={name} className={`pc2-sel-chip${name === preferredColor ? ' preferred' : ''}`}>
                  {name === preferredColor ? '★ ' : ''}{name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pc2-storage-section">
        <span className="pc2-section-title">Memoria</span>
        <div className="pc2-chips">
          {variants.map((v, i) => (
            <button
              key={v.id}
              className={`pc2-chip${i === selectedStorageIdx ? ' selected' : ''}`}
              onClick={() => setSelectedStorageIdx(i)}
            >
              <span className="pc2-chip-storage">{v.storage}</span>
              <span className="pc2-chip-price">€{v.price}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="pc2-btn-add" onClick={handleAdd} disabled={!canAdd}>
        {btnText}
      </button>
    </div>
  );
}
