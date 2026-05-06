import React, { useState } from 'react';
import { modelColors, modelSpecs, modelImageUrl } from '../data/iphones';

/* ─────────────────────────────────────────────
   Lens — clean optical glass look
   Single light source (top-left).
   Mount ring → glass surface (radial gradient) → crescent specular.
───────────────────────────────────────────── */
function Lens({ cx, cy, r, gradId }) {
  // Crescent arc: upper-left quadrant of the glass surface
  const hr = r * 0.74;                                   // highlight orbit radius
  const x1 = cx - hr * 0.88, y1 = cy - hr * 0.22;      // arc start  (~9 o'clock)
  const x2 = cx - hr * 0.18, y2 = cy - hr * 0.96;      // arc end    (~12 o'clock)
  const ar = hr * 0.85;                                  // arc curvature radius

  return (
    <g>
      {/* Outer barrel mount – dark charcoal ring */}
      <circle cx={cx} cy={cy} r={r} fill="#18181c" />
      {/* Subtle top-edge highlight on mount ring */}
      <circle cx={cx} cy={cy} r={r - 0.8} fill="none"
              stroke="rgba(255,255,255,.10)" strokeWidth="1.2" />
      {/* Glass surface with depth radial gradient */}
      <circle cx={cx} cy={cy} r={r * 0.80} fill={`url(#${gradId})`} />
      {/* AR-coating iridescent bloom (off-centre blue-purple) */}
      <circle cx={cx - r * 0.12} cy={cy - r * 0.10} r={r * 0.52}
              fill="rgba(38,55,160,.28)" />
      {/* Crescent specular highlight – single thin arc */}
      <path d={`M ${x1} ${y1} A ${ar} ${ar} 0 0 0 ${x2} ${y2}`}
            fill="none"
            stroke="rgba(255,255,255,.55)"
            strokeWidth={Math.max(1, r * 0.075)}
            strokeLinecap="round" />
      {/* Tiny secondary glint dot */}
      <circle cx={cx - r * 0.44} cy={cy - r * 0.44} r={r * 0.065}
              fill="rgba(255,255,255,.40)" />
    </g>
  );
}

/* Flash — compact, accurate */
function Flash({ cx, cy, r = 10 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r}        fill="#111114" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#1e1800" />
      <circle cx={cx} cy={cy} r={r * 0.40} fill="#f5c400" opacity=".80" />
      {/* tiny specular on flash glass */}
      <circle cx={cx - r * 0.18} cy={cy - r * 0.22} r={r * 0.10}
              fill="rgba(255,255,255,.45)" />
    </g>
  );
}

/* LiDAR sensor */
function LiDAR({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7}   fill="#14082a" />
      <circle cx={cx} cy={cy} r={4.5} fill="#2a0d5a" />
      <circle cx={cx} cy={cy} r={2.5} fill="#3d1280" opacity=".75" />
    </g>
  );
}

/* ─────────────────────────────────────────────
   Main back-view SVG render
───────────────────────────────────────────── */
function PhoneBackSVG({ model, colorHex }) {
  const fill = colorHex || '#c8c8cc';
  const uid  = `bk${model.replace(/\W/g, '').slice(-12)}`;

  const isSE  = model.includes('SE');
  const isPro = model.includes('Pro');
  const num   = parseInt(model.match(/iPhone (\d+)/)?.[1] || '0');

  /* Camera configuration */
  let cam;
  if (isSE)                     cam = model.includes('2020') ? 'se20' : 'se22';
  else if (num === 17 && isPro)  cam = 'bar_pro';
  else if (num === 17)           cam = 'bar_std';
  else if (isPro)                cam = 'triple';
  else if (num >= 14)            cam = 'dual_v';
  else                           cam = 'dual_d';

  /* Colour math */
  const rr = parseInt(fill.slice(1, 3), 16) || 180;
  const gg = parseInt(fill.slice(3, 5), 16) || 180;
  const bb = parseInt(fill.slice(5, 7), 16) || 180;
  const lum     = (0.299 * rr + 0.587 * gg + 0.114 * bb) / 255;
  const isLight = lum > 0.55;
  const dk      = (v, a) => Math.max(0, v - a);
  const bumpFill = `rgb(${dk(rr,20)},${dk(gg,20)},${dk(bb,20)})`;

  /* Bump geometry */
  const bumps = {
    triple:  { x: 22, y: 14, w: 132, h: 132, rx: 28 },
    dual_v:  { x: 22, y: 14, w: 108, h: 118, rx: 24 },
    dual_d:  { x: 22, y: 14, w: 110, h: 110, rx: 24 },
    se22:    { x: 32, y: 20, w:  84, h:  84, rx: 20 },
    bar_pro: { x: 16, y: 14, w: 268, h:  78, rx: 34 },
    bar_std: { x: 16, y: 14, w: 268, h:  70, rx: 30 },
  };
  const bump = bumps[cam];
  const lensGradId = `${uid}lg`;

  /* Lens layout per camera type */
  function renderCameras() {
    const L = (cx, cy, r) => <Lens key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} gradId={lensGradId} />;
    const F = (cx, cy, r) => <Flash key={`f${cx}`} cx={cx} cy={cy} r={r} />;
    const D = (cx, cy)    => <LiDAR key={`d${cx}`} cx={cx} cy={cy} />;

    switch (cam) {
      case 'triple':  return <>{L(68,57,24)} {L(108,46,21)} {L(82,95,21)} {F(118,96,10)} {D(104,114)}</>;
      case 'dual_v':  return <>{L(70,54,22)}  {L(70,93,20)}  {F(99,73,10)}</>;
      case 'dual_d':  return <>{L(83,47,22)}  {L(54,81,20)}  {F(91,85,10)}</>;
      case 'se22':    return <>{L(72,68,28)}  {F(104,47,9)}</>;
      case 'se20':    return  <>{L(150,70,36)}</>;
      case 'bar_pro': return <>{L(64,51,24)}  {L(118,51,22)} {L(91,51,18)} {F(172,41,11)} {D(172,61)}</>;
      case 'bar_std': return <>{L(68,47,22)}  {L(118,47,20)} {F(163,47,10)}</>;
      default:        return null;
    }
  }

  /*
    Apple logo — Material Design path (24×24 unit grid).
    Centred at approx (150, 300) in the 300×600 viewBox.
    translate(103, 254) scale(4) → center ≈ (103+12.8*4, 254+12*4) = (154, 302)
  */
  const applePath =
    'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79' +
    '-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 ' +
    '4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 ' +
    '2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 ' +
    '3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83' +
    'M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 ' +
    '3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z';

  /* Logo colour: engraved-look — same hue as body, slightly offset */
  const logoFill = isLight ? 'rgba(0,0,0,.22)' : 'rgba(255,255,255,.30)';

  /* Button fill: body colour with barely-perceptible surface gradient */
  const btnFill = fill;

  return (
    <svg
      viewBox="0 0 300 600"
      width="88"
      height="176"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 22px rgba(0,0,0,.26))' }}
      aria-hidden="true"
    >
      <defs>
        {/* ── Body: single diagonal gradient (top-left light source) ── */}
        <linearGradient id={`${uid}bd`} gradientUnits="userSpaceOnUse"
                        x1="55"  y1="20"  x2="245" y2="580">
          <stop offset="0%"   stopColor={isLight ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.12)'} />
          <stop offset="55%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={isLight ? 'rgba(0,0,0,.10)' : 'rgba(0,0,0,.20)'} />
        </linearGradient>

        {/* ── Bump: same diagonal, slightly stronger ── */}
        <linearGradient id={`${uid}bp`} gradientUnits="userSpaceOnUse"
                        x1="30" y1="15" x2="150" y2="150">
          <stop offset="0%"   stopColor="rgba(255,255,255,.14)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.12)" />
        </linearGradient>

        {/* ── Lens glass: radial, off-centre toward top-left ── */}
        <radialGradient id={lensGradId} gradientUnits="objectBoundingBox"
                        cx=".38" cy=".34" r=".72">
          <stop offset="0%"   stopColor="rgba(22,38,120,.75)" />
          <stop offset="38%"  stopColor="rgba(6,10,28,.90)" />
          <stop offset="100%" stopColor="rgba(0,0,0,1)" />
        </radialGradient>
      </defs>

      {/* ── Side buttons ──
          Each button uses fill=body + edge strokes matching body finish */}
      {/* Action button */}
      <rect x="1" y="68"  width="11" height="28" rx="5"
            fill={btnFill} stroke="rgba(0,0,0,.26)" strokeWidth="1.2" />
      <rect x="2" y="69"  width="5"  height="10" rx="2"
            fill="rgba(255,255,255,.12)" />
      {/* Vol + */}
      <rect x="1" y="108" width="11" height="48" rx="5"
            fill={btnFill} stroke="rgba(0,0,0,.26)" strokeWidth="1.2" />
      {/* Vol − */}
      <rect x="1" y="166" width="11" height="48" rx="5"
            fill={btnFill} stroke="rgba(0,0,0,.26)" strokeWidth="1.2" />
      {/* Power */}
      <rect x="288" y="132" width="11" height="60" rx="5"
            fill={btnFill} stroke="rgba(0,0,0,.26)" strokeWidth="1.2" />

      {/* ── Phone body base ── */}
      <rect x="12" y="8" width="276" height="584" rx="66" fill={fill} />

      {/* ── Body directional gradient overlay ── */}
      <rect x="12" y="8" width="276" height="584" rx="66"
            fill={`url(#${uid}bd)`} />

      {/* ── Outer rim (shadow edge — bottom/right) ── */}
      <rect x="12.5" y="8.5" width="275" height="583" rx="65.5"
            fill="none" stroke="rgba(0,0,0,.32)" strokeWidth="1.2" />

      {/* ── Inner chamfer line (light catches the machined edge) ── */}
      <rect x="15" y="11" width="270" height="578" rx="63"
            fill="none"
            stroke={isLight ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.13)'}
            strokeWidth="1" />

      {/* ── Camera bump ── */}
      {bump && (
        <>
          {/* Bump base */}
          <rect x={bump.x} y={bump.y} width={bump.w} height={bump.h} rx={bump.rx}
                fill={bumpFill} />
          {/* Bump directional gloss */}
          <rect x={bump.x} y={bump.y} width={bump.w} height={bump.h} rx={bump.rx}
                fill={`url(#${uid}bp)`} />
          {/* Bump shadow rim */}
          <rect x={bump.x + .5} y={bump.y + .5}
                width={bump.w - 1} height={bump.h - 1} rx={bump.rx - .5}
                fill="none" stroke="rgba(0,0,0,.30)" strokeWidth="1" />
          {/* Bump top-left highlight (raised edge catching light) */}
          <rect x={bump.x + 1} y={bump.y + 1}
                width={bump.w - 2} height={bump.h - 2} rx={bump.rx - 1}
                fill="none"
                stroke="rgba(255,255,255,.18)" strokeWidth=".8" />
        </>
      )}

      {/* ── Camera lenses & flash ── */}
      {renderCameras()}

      {/* ── Apple logo (engraved / laser-etched look) ── */}
      <g transform="translate(103, 254) scale(4)" fill={logoFill}>
        <path d={applePath} />
      </g>

      {/* ── Bottom: USB-C port + speaker grilles ── */}
      <rect x="128" y="577" width="44" height="11" rx="5.5" fill="rgba(0,0,0,.18)" />
      {/* Speaker dots — left cluster */}
      {[82, 90, 98].map(x => (
        <circle key={x} cx={x} cy={583} r="2.8" fill="rgba(0,0,0,.16)" />
      ))}
      {/* Speaker dots — right cluster */}
      {[202, 210, 218].map(x => (
        <circle key={x} cx={x} cy={583} r="2.8" fill="rgba(0,0,0,.16)" />
      ))}
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
