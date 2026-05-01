import React, { useState, useMemo } from 'react';
import { iphones, modelImageUrl } from '../data/iphones';
import ProductCard from './ProductCard';

const HERO_MODEL = 'iPhone 16 Pro Max';

export default function Catalog({ onAdd }) {
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState('');

  const groups = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = iphones.filter(p => {
      const matchSearch = !q || p.model.toLowerCase().includes(q);
      const matchAvail = !filterAvail || p.availability === filterAvail;
      return matchSearch && matchAvail;
    });

    const map = {};
    filtered.forEach(p => {
      if (!map[p.model]) {
        map[p.model] = { model: p.model, availability: p.availability, isNew: p.isNew || false, variants: [] };
      }
      map[p.model].variants.push(p);
    });
    return Object.values(map);
  }, [search, filterAvail]);

  return (
    <section className="catalog-section">

      {/* ── Hero banner ── */}
      <div className="catalog-hero">
        <img
          src={modelImageUrl(HERO_MODEL)}
          alt={HERO_MODEL}
          className="hero-img"
        />
        <div className="hero-content">
          <p className="hero-eyebrow">iPhone Ricondizionati certificati</p>
          <h1 className="hero-title">Qualità Apple.<br />Prezzo accessibile.</h1>
          <p className="hero-sub">
            Garanzia 12 mesi sul telefono · 3 mesi sulla batteria<br />
            Ricondizionati selezionati — da iPhone SE a iPhone 17 Pro Max
          </p>
          <div className="hero-badges">
            <span className="hero-badge">✓ IVA inclusa</span>
            <span className="hero-badge">✓ Consegna in sede</span>
            <span className="hero-badge">✓ 13 sedi disponibili</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Listino iPhone</h2>

      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Cerca modello..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterAvail}
          onChange={e => setFilterAvail(e.target.value)}
        >
          <option value="">Tutti</option>
          <option value="available">Disponibile</option>
          <option value="on-request">Previa disponibilità</option>
        </select>
      </div>

      <p className="results-count">{groups.length} modell{groups.length === 1 ? 'o' : 'i'} trovat{groups.length === 1 ? 'o' : 'i'}</p>

      <div className="product-grid">
        {groups.map(g => (
          <ProductCard key={g.model} group={g} onAdd={onAdd} />
        ))}
      </div>

      <div className="catalog-legend">
        <span className="legend-item"><span className="badge badge-request">⚠ Previa disponibilità</span> Contattare Daniele prima di confermare</span>
        <span className="legend-item"><span className="badge badge-new">NUOVO</span> Prezzo riferito al prodotto nuovo (non ricondizionato)</span>
      </div>

      <p className="catalog-warranty">
        Garanzia 12 mesi sul telefono + 3 mesi sulla batteria su tutti i dispositivi ricondizionati
      </p>
    </section>
  );
}
