import React from 'react';
import { modelColors } from '../data/iphones';

export default function Cart({ items, onRemove, onQuantityChange }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <p>Nessun prodotto selezionato</p>
        <p className="cart-empty-sub">Configura un modello e aggiungilo all'ordine</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h3 className="cart-title">Ordine in corso</h3>
      <ul className="cart-list">
        {items.map(item => {
          const palette = modelColors[item.model] || [];
          const dots = (item.colors || []).map(name => {
            const c = palette.find(mc => mc.name === name);
            return c ? { name, hex: c.hex, preferred: name === item.preferredColor } : null;
          }).filter(Boolean);

          return (
            <li key={item.cartKey} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.model}</span>
                <span className="cart-item-sub">
                  {item.storage}{item.isNew ? ' · NUOVO' : ''}
                </span>
                {dots.length > 0 && (
                  <div className="cart-color-dots">
                    {dots.map(c => (
                      <span
                        key={c.name}
                        className={`cart-dot${c.preferred ? ' preferred' : ''}`}
                        style={{ background: c.hex }}
                        title={c.name + (c.preferred ? ' ★' : '')}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="cart-item-controls">
                <button className="qty-btn" onClick={() => onQuantityChange(item.cartKey, item.qty - 1)}>−</button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => onQuantityChange(item.cartKey, item.qty + 1)}>+</button>
              </div>
              <span className="cart-item-price">€{(item.price * item.qty).toFixed(2)}</span>
              <button className="cart-remove" onClick={() => onRemove(item.cartKey)}>✕</button>
            </li>
          );
        })}
      </ul>
      <div className="cart-total">
        <span>Totale</span>
        <span className="cart-total-amount">€{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
