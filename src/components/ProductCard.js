import React from 'react';
import { gradeDescriptions } from '../data/iphones';

const gradeBadgeColor = { A: '#22c55e', B: '#f59e0b', C: '#ef4444' };

export default function ProductCard({ phone, onAdd }) {
  return (
    <div className="product-card">
      <div className="product-icon">📱</div>
      <div className="product-info">
        <h3 className="product-model">{phone.model}</h3>
        <div className="product-details">
          <span className="detail-tag">{phone.storage}</span>
          <span className="detail-tag">{phone.color}</span>
          <span
            className="grade-badge"
            style={{ background: gradeBadgeColor[phone.grade] }}
            title={gradeDescriptions[phone.grade]}
          >
            Grado {phone.grade}
          </span>
        </div>
        <p className="grade-desc">{gradeDescriptions[phone.grade]}</p>
        <div className="product-footer">
          <span className="product-price">€{phone.price.toFixed(2)}</span>
          <button className="btn-add" onClick={() => onAdd(phone)}>
            + Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}
