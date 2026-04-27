import React, { useState } from 'react';
import { modelColors, modelSpecs, modelImageUrl } from '../data/iphones';

// Wraps PhoneShape with a real <img> overlay; img stays hidden until it loads,
// so a missing file (404) leaves the SVG visible underneath.
function PhonePreview({ model, colorHex }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="pc2-phone-wrap">
      <PhoneShape model={model} colorHex={colorHex} />
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

function PhoneShape({ model, colorHex }) {
  const isSE  = model.includes('SE');
  const isPro = model.includes('Pro');
  const year  = parseInt(model.match(/iPhone (\d+)/)?.[1] || '0');
  const hasDI = !isSE && ((year === 14 && isPro) || year >= 15);
  const fill  = colorHex || '#e5e5ea';
  // short unique id for gradient refs (no spaces/special chars)
  const uid   = `p${model.replace(/\W/g, '')}`;
  const yBar  = hasDI ? 28 : isSE ? 17 : 22;
  const yTime = hasDI ? 58 : isSE ? 44 : 50;

  return (
    <svg
      viewBox="0 0 80 164"
      width="76"
      height="155"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.26))' }}
      aria-hidden="true"
    >
      <defs>
        {/* Body shine: bright top-left → dark bottom-right */}
        <linearGradient id={`${uid}bg`} x1="0.1" y1="0" x2="0.9" y2="1.3">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.48)" />
          <stop offset="30%"  stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.20)" />
        </linearGradient>
        {/* iOS wallpaper gradient */}
        <linearGradient id={`${uid}sc`} x1="0.4" y1="0" x2="0.6" y2="1">
          <stop offset="0%"   stopColor="#1b2f58" />
          <stop offset="55%"  stopColor="#0d1530" />
          <stop offset="100%" stopColor="#060912" />
        </linearGradient>
        {/* Left-edge screen shimmer */}
        <linearGradient id={`${uid}sh`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.16)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={`${uid}cl`}>
          <rect x="6" y="9" width="68" height="146" rx="10" />
        </clipPath>
      </defs>

      {/* ── Side buttons (behind body, peek out) ── */}
      {/* Left: volume up */}
      <rect x="1" y="42" width="5" height="17" rx="2" fill={fill} stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
      {/* Left: volume down */}
      <rect x="1" y="63" width="5" height="17" rx="2" fill={fill} stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
      {/* Left: mute / action button */}
      <rect x="1" y="27" width="5" height="11" rx="2" fill={fill} stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
      {/* Right: power */}
      <rect x="74" y="50" width="5" height="24" rx="2" fill={fill} stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />

      {/* ── Phone body ── */}
      <rect x="4" y="2"  width="72" height="160" rx="19" fill={fill} />
      <rect x="4" y="2"  width="72" height="160" rx="19" fill={`url(#${uid}bg)`} />
      <rect x="4" y="2"  width="72" height="160" rx="19" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.2" />

      {/* ── Screen bezel ── */}
      <rect x="5.5" y="8.5" width="69" height="147" rx="11" fill="#04070e" />

      {/* ── Screen content ── */}
      <rect x="6" y="9" width="68" height="146" rx="10" fill={`url(#${uid}sc)`} />
      {/* Left-edge shimmer over screen */}
      <rect x="6" y="9" width="34" height="146" rx="10" fill={`url(#${uid}sh)`} clipPath={`url(#${uid}cl)`} />

      {/* ── Top hardware ── */}
      {isSE ? (
        <>
          {/* Ear speaker pill */}
          <rect x="27" y="3.5" width="26" height="5" rx="2.5" fill="rgba(0,0,0,0.24)" />
          {/* Front camera */}
          <circle cx="64" cy="6" r="2.8" fill="rgba(0,0,0,0.2)" />
        </>
      ) : hasDI ? (
        /* Dynamic Island */
        <rect x="25.5" y="13.5" width="29" height="11" rx="5.5" fill="#04070e" />
      ) : (
        /* Notch */
        <rect x="20" y="9" width="40" height="8" rx="4" fill="#04070e" />
      )}

      {/* ── Status bar ── */}
      {/* Signal dots */}
      <circle cx="13" cy={yBar} r="1.6" fill="rgba(255,255,255,0.35)" />
      <circle cx="17" cy={yBar} r="1.6" fill="rgba(255,255,255,0.35)" />
      <circle cx="21" cy={yBar} r="1.6" fill="rgba(255,255,255,0.35)" />
      {/* Battery bar */}
      <rect x="55" y={yBar - 3.5} width="16" height="7" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <rect x="56" y={yBar - 2.5} width="11" height="5" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="71" y={yBar - 1.5} width="2" height="3" rx="1" fill="rgba(255,255,255,0.3)" />

      {/* ── Clock (Apple's iconic 9:41) ── */}
      <text
        x="40" y={yTime}
        textAnchor="middle"
        fill="rgba(255,255,255,0.92)"
        fontSize="14"
        fontWeight="200"
        fontFamily="-apple-system, SF Pro Display, Helvetica Neue, sans-serif"
        letterSpacing="-0.5"
      >
        9:41
      </text>

      {/* ── Bottom elements ── */}
      {isSE ? (
        /* Home button */
        <>
          <circle cx="40" cy="150" r="9"   fill="none" stroke={fill}              strokeWidth="2"   />
          <circle cx="40" cy="150" r="6.5" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
          <circle cx="40" cy="150" r="2"   fill="rgba(0,0,0,0.1)" />
        </>
      ) : (
        /* Home indicator pill */
        <rect x="28" y="148" width="24" height="4" rx="2" fill="rgba(255,255,255,0.52)" />
      )}

      {/* Bottom port */}
      <rect x="34" y="160" width="12" height="4" rx="2" fill="rgba(0,0,0,0.18)" />
      {/* Speaker grille dots */}
      <circle cx="22" cy="162" r="1.3" fill="rgba(0,0,0,0.22)" />
      <circle cx="26" cy="162" r="1.3" fill="rgba(0,0,0,0.22)" />
      <circle cx="54" cy="162" r="1.3" fill="rgba(0,0,0,0.22)" />
      <circle cx="58" cy="162" r="1.3" fill="rgba(0,0,0,0.22)" />
    </svg>
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
      {/* Header: phone preview + model info */}
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
                <span className="pc2-spec" title="Fotocamera posteriore">📷 {specs.rearCam}</span>
              </div>
              <div className="pc2-specs">
                <span className="pc2-spec" title="Batteria">🔋 {specs.battery}</span>
                <span className="pc2-spec" title="Connettore">🔌 {specs.connector}</span>
                <span className="pc2-spec" title="Sblocco">{specs.biometric === 'Face ID' ? '😀' : '👆'} {specs.biometric}</span>
                {specs.fiveG && <span className="pc2-spec pc2-spec-on">5G</span>}
                {specs.promotion && <span className="pc2-spec pc2-spec-on">ProMotion 120Hz</span>}
                {specs.intelligence && <span className="pc2-spec pc2-spec-on">Apple Intelligence</span>}
                <span className="pc2-spec" title="Anno di lancio">📅 {specs.year}</span>
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

      {/* Color picker: up to 3, 1× select, 2× set preferred */}
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

      {/* Storage selector */}
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
