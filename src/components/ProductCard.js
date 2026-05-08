import React, { useState } from 'react';
import { modelColors, modelSpecs } from '../data/iphones';

const CARD_IMG = `${process.env.PUBLIC_URL || '.'}/images/iphone-card.png`;

/* ── Uniform brand image for all cards ── */
function PhonePreview() {
  return (
    <div className="pc2-phone-wrap" style={{ width: 88, height: 176 }}>
      <img
        src={CARD_IMG}
        alt="iPhone"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
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
