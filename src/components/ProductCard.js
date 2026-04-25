import React, { useState } from 'react';
import { modelColors } from '../data/iphones';

export default function ProductCard({ group, onAdd }) {
  const { model, availability, isNew, variants } = group;
  const colors = modelColors[model] || [];
  const defaultColorIdx = colors.findIndex(c => c.preferred);

  const [selectedStorageIdx, setSelectedStorageIdx] = useState(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(defaultColorIdx >= 0 ? defaultColorIdx : 0);

  const currentVariant = selectedStorageIdx !== null ? variants[selectedStorageIdx] : null;
  const currentColor   = colors[selectedColorIdx] || null;
  const isOnRequest    = availability === 'on-request';

  function handleAdd() {
    if (!currentVariant || !currentColor) return;
    onAdd({ ...currentVariant, color: currentColor });
  }

  return (
    <div
      className={`product-card2${isOnRequest ? ' on-request' : ''}`}
      style={{ '--card-accent': currentColor?.hex || '#0071e3' }}
    >
      {/* Header */}
      <div className="pc2-header">
        <span className="pc2-model">{model}</span>
        <div className="pc2-badges">
          {isNew      && <span className="badge badge-new">NUOVO</span>}
          {isOnRequest && <span className="badge badge-request">⚠ Previa disp.</span>}
        </div>
      </div>

      {isOnRequest && !isNew && (
        <p className="on-request-note">Contattare Daniele per la disponibilità</p>
      )}
      {isNew && (
        <p className="on-request-note new-note">Prezzo riferito al prodotto NUOVO</p>
      )}

      {/* Color picker */}
      {colors.length > 0 && (
        <div className="pc2-color-section">
          <div className="pc2-color-label">
            <span className="pc2-section-title">Colore</span>
            <span className="pc2-color-name">
              {currentColor?.name}
              {currentColor?.preferred && <span className="pc2-preferred-tag">★ Preferito</span>}
            </span>
          </div>
          <div className="pc2-swatches">
            {colors.map((c, i) => (
              <button
                key={c.name}
                className={`pc2-swatch${i === selectedColorIdx ? ' selected' : ''}`}
                style={{ background: c.hex, '--sw': c.hex }}
                onClick={() => setSelectedColorIdx(i)}
                title={c.name + (c.preferred ? ' ★ Preferito' : '')}
              >
                {c.preferred && i !== selectedColorIdx && (
                  <span className="sw-star">★</span>
                )}
              </button>
            ))}
          </div>
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

      {/* CTA */}
      <button
        className="pc2-btn-add"
        onClick={handleAdd}
        disabled={!currentVariant}
      >
        {currentVariant
          ? `Aggiungi al carrello — €${currentVariant.price}`
          : 'Seleziona la memoria'}
      </button>
    </div>
  );
}
