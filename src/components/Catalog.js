import React, { useState, useMemo } from 'react';
import { iphones } from '../data/iphones';
import ProductCard from './ProductCard';

const allModels = [...new Set(iphones.map(p => p.model))];
const allGrades = ['A', 'B', 'C'];

export default function Catalog({ onAdd }) {
  const [search, setSearch] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [sortBy, setSortBy] = useState('model');

  const filtered = useMemo(() => {
    let list = iphones.filter(p => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.model.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.storage.toLowerCase().includes(q);
      const matchModel = !filterModel || p.model === filterModel;
      const matchGrade = !filterGrade || p.grade === filterGrade;
      return matchSearch && matchModel && matchGrade;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.model.localeCompare(b.model);
    });

    return list;
  }, [search, filterModel, filterGrade, sortBy]);

  return (
    <section className="catalog-section">
      <h2 className="section-title">Catalogo iPhone Ricondizionati</h2>

      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Cerca modello, colore, storage..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterModel}
          onChange={e => setFilterModel(e.target.value)}
        >
          <option value="">Tutti i modelli</option>
          {allModels.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filterGrade}
          onChange={e => setFilterGrade(e.target.value)}
        >
          <option value="">Tutti i gradi</option>
          {allGrades.map(g => (
            <option key={g} value={g}>Grado {g}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="model">Ordina per modello</option>
          <option value="price-asc">Prezzo crescente</option>
          <option value="price-desc">Prezzo decrescente</option>
        </select>
      </div>

      <p className="results-count">{filtered.length} prodotti trovati</p>

      <div className="product-grid">
        {filtered.map(phone => (
          <ProductCard key={phone.id} phone={phone} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
