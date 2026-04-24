import React from 'react';

export default function ProductCard({ group, onAdd }) {
  const { model, availability, isNew, variants } = group;

  return (
    <div className={`product-card ${availability === 'on-request' ? 'on-request' : ''}`}>
      <div className="product-card-header">
        <span className="product-model">{model}</span>
        <div className="product-badges">
          {isNew && <span className="badge badge-new">NUOVO</span>}
          {availability === 'on-request' && (
            <span className="badge badge-request">⚠ Previa disponibilità</span>
          )}
        </div>
      </div>

      {availability === 'on-request' && (
        <p className="on-request-note">Contattare Daniele per verificare la disponibilità</p>
      )}
      {isNew && (
        <p className="on-request-note new-note">Prezzo riferito al prodotto NUOVO</p>
      )}

      <div className="storage-chips">
        {variants.map(v => (
          <button
            key={v.id}
            className="chip"
            onClick={() => onAdd(v)}
            title={`Aggiungi ${model} ${v.storage} al carrello`}
          >
            <span className="chip-storage">{v.storage}</span>
            <span className="chip-price">€{v.price}</span>
            <span className="chip-add">+</span>
          </button>
        ))}
      </div>
    </div>
  );
}
