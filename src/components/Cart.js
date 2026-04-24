import React from 'react';

export default function Cart({ items, onRemove, onQuantityChange }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <p>Il carrello è vuoto</p>
        <p className="cart-empty-sub">Aggiungi prodotti dal catalogo</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h3 className="cart-title">Riepilogo Ordine</h3>
      <ul className="cart-list">
        {items.map(item => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.model}</span>
              <span className="cart-item-sub">{item.storage} · {item.color} · Grado {item.grade}</span>
            </div>
            <div className="cart-item-controls">
              <button
                className="qty-btn"
                onClick={() => onQuantityChange(item.id, item.qty - 1)}
              >−</button>
              <span className="qty-value">{item.qty}</span>
              <button
                className="qty-btn"
                onClick={() => onQuantityChange(item.id, item.qty + 1)}
              >+</button>
            </div>
            <span className="cart-item-price">€{(item.price * item.qty).toFixed(2)}</span>
            <button className="cart-remove" onClick={() => onRemove(item.id)}>✕</button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <span>Totale</span>
        <span className="cart-total-amount">€{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
