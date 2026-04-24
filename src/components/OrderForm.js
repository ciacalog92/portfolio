import React, { useState } from 'react';
import { sedi } from '../data/iphones';

const initial = { nome: '', cognome: '', cellulare: '', email: '', sede: '' };

function validate(f) {
  const e = {};
  if (!f.nome.trim())     e.nome     = 'Campo obbligatorio';
  if (!f.cognome.trim())  e.cognome  = 'Campo obbligatorio';
  if (!f.cellulare.trim()) e.cellulare = 'Campo obbligatorio';
  else if (!/^[\d\s\+\-]{6,15}$/.test(f.cellulare)) e.cellulare = 'Numero non valido';
  if (!f.email.trim())    e.email    = 'Campo obbligatorio';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email non valida';
  if (!f.sede)            e.sede     = 'Seleziona la sede';
  return e;
}

export default function OrderForm({ cartItems, onOrderComplete }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onOrderComplete({ customer: form, items: cartItems, total });
  }

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Dati Cliente</h2>

      <div className="form-row">
        <Field label="Nome *" error={errors.nome}>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Mario" autoComplete="given-name" />
        </Field>
        <Field label="Cognome *" error={errors.cognome}>
          <input name="cognome" value={form.cognome} onChange={handleChange} placeholder="Rossi" autoComplete="family-name" />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Cellulare *" error={errors.cellulare}>
          <input name="cellulare" type="tel" value={form.cellulare} onChange={handleChange} placeholder="+39 333 1234567" autoComplete="tel" />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="mario.rossi@email.it" autoComplete="email" />
        </Field>
      </div>

      <h2 className="section-title" style={{ marginTop: 8 }}>Sede</h2>

      <Field label="Sede di riferimento *" error={errors.sede}>
        <select name="sede" value={form.sede} onChange={handleChange} className="field-select">
          <option value="">— Seleziona sede —</option>
          {sedi.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <h2 className="section-title" style={{ marginTop: 8 }}>Riepilogo Ordine</h2>

      <div className="form-summary">
        {cartItems.map(item => (
          <div key={item.id} className="summary-line">
            <span>{item.model} {item.storage}{item.isNew ? ' (NUOVO)' : ''} × {item.qty}</span>
            <span>€{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Totale</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" className="btn-submit">Conferma Ordine →</button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
