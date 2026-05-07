import React, { useState } from 'react';
import { modelColors, modelSpecs, modelImageUrl } from '../data/iphones';

/* ─────────────────────────────────────────────
   PhoneIcon — single professional icon,
   identical for all models.
   Front-view silhouette, editorial style.
───────────────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 88 176"
      width="88"
      height="176"
      style={{ display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.28))' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pi-screen" x1=".4" y1="0" x2=".6" y2="1">
          <stop offset="0%"   stopColor="#1e3a6e" />
          <stop offset="55%"  stopColor="#0b1630" />
          <stop offset="100%" stopColor="#04080f" />
        </linearGradient>
        <linearGradient id="pi-body" x1=".12" y1="0" x2=".88" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,.14)" />
        </linearGradient>
        <linearGradient id="pi-shimmer" x1="0" y1=".5" x2="1" y2=".5">
          <stop offset="0%"   stopColor="rgba(255,255,255,.18)" />
          <stop offset="12%"  stopColor="rgba(255,255,255,.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Side buttons */}
      <rect x="1"  y="52" width="3.5" height="11" rx="1.8" fill="#2a2a2c" />
      <rect x="1"  y="67" width="3.5" height="20" rx="1.8" fill="#2a2a2c" />
      <rect x="1"  y="91" width="3.5" height="20" rx="1.8" fill="#2a2a2c" />
      <rect x="83.5" y="62" width="3.5" height="28" rx="1.8" fill="#2a2a2c" />

      {/* Body */}
      <rect x="4" y="2" width="80" height="172" rx="21" fill="#1c1c1e" />
      <rect x="4" y="2" width="80" height="172" rx="21" fill="url(#pi-body)" />
      <rect x="4" y="2" width="80" height="172" rx="21" fill="url(#pi-shimmer)" />
      <rect x="4.6" y="2.6" width="78.8" height="170.8" rx="20.5"
            fill="none" stroke="rgba(255,255,255,.10)" strokeWidth=".8" />

      {/* Screen bezel */}
      <rect x="5.5" y="3.5" width="77" height="169" rx="19.5" fill="#080808" />

      {/* Screen */}
      <rect x="6" y="4" width="76" height="168" rx="19" fill="url(#pi-screen)" />

      {/* Dynamic Island */}
      <rect x="26" y="11" width="36" height="11" rx="5.5" fill="#000" />

      {/* Status bar — signal dots */}
      <circle cx="15" cy="24" r="1.6" fill="rgba(255,255,255,.30)" />
      <circle cx="19" cy="24" r="1.6" fill="rgba(255,255,255,.30)" />
      <circle cx="23" cy="24" r="1.6" fill="rgba(255,255,255,.30)" />
      {/* Battery */}
      <rect x="63" y="20.5" width="14" height="7" rx="2"
            fill="none" stroke="rgba(255,255,255,.28)" strokeWidth=".9" />
      <rect x="64" y="21.5" width="9.5" height="5" rx="1"
            fill="rgba(255,255,255,.32)" />
      <rect x="77" y="23" width="1.8" height="3" rx=".9"
            fill="rgba(255,255,255,.25)" />

      {/* Clock */}
      <text
        x="44" y="50"
        textAnchor="middle"
        fill="rgba(255,255,255,.90)"
        fontSize="16"
        fontWeight="200"
        fontFamily="-apple-system, SF Pro Display, Helvetica Neue, sans-serif"
        letterSpacing="-0.5"
      >
        9:41
      </text>

      {/* App grid — 4 × 3 subtle dots suggesting home screen */}
      {[0,1,2,3].map(col =>
        [0,1,2].map(row => (
          <rect
            key={`${col}-${row}`}
            x={18 + col * 14} y={70 + row * 20}
            width="10" height="10" rx="2.5"
            fill="rgba(255,255,255,.07)"
          />
        ))
      )}

      {/* Home indicator */}
      <rect x="27" y="160" width="34" height="4" rx="2"
            fill="rgba(255,255,255,.38)" />

      {/* Bottom port */}
      <rect x="35" y="170" width="18" height="3" rx="1.5"
            fill="rgba(255,255,255,.10)" />
    </svg>
  );
}

/* ── Preview: icon + real-photo overlay when available ── */
function PhonePreview({ model }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="pc2-phone-wrap" style={{ width: 88, height: 176 }}>
      <PhoneIcon />
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
          <PhonePreview model={model} />
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
