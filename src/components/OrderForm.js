import React, { useState } from 'react';
import { sedi } from '../data/iphones';

const initial = { nome: '', cognome: '', cellulare: '', email: '', sede: '' };

const BUNDLE_PRICE    = 65;
const BUNDLE_FULL     = 120;
const BUNDLE_ITEMS    = [
  'Trasferimento dati',
  'Cover',
  'Kit alimentatore + cavo',
  'Vetro temperato',
  'Pellicole fotocamere',
];

function validate(f) {
  const e = {};
  if (!f.nome.trim())       e.nome      = 'Campo obbligatorio';
  if (!f.cognome.trim())    e.cognome   = 'Campo obbligatorio';
  if (!f.cellulare.trim())  e.cellulare = 'Campo obbligatorio';
  else if (!/^[-\d\s+]{6,15}$/.test(f.cellulare)) e.cellulare = 'Numero non valido';
  if (!f.email.trim())      e.email     = 'Campo obbligatorio';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email non valida';
  if (!f.sede)              e.sede      = 'Seleziona la sede';
  return e;
}

function buildMailtoUrl(customer, items, total, bundle) {
  const date = new Date().toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const subject = `Nuovo ordine iPhone — ${customer.nome} ${customer.cognome} — Sede ${customer.sede}`;

  const itemLines = items.map((item, i) => {
    const colorStr = (item.colors || [])
      .map(c => c === item.preferredColor ? `${c} ★ (preferito)` : c)
      .join(', ');
    const lines = [
      `${i + 1}. ${item.model}  ${item.storage}${item.isNew ? ' (NUOVO)' : ''}  x${item.qty}  →  €${(item.price * item.qty).toFixed(2)}`,
    ];
    if (colorStr) lines.push(`   Colori: ${colorStr}`);
    return lines.join('\n');
  });

  const bundleLines = bundle ? [
    '',
    'BUNDLE ACCESSORI (€65 anziché €120)',
    `   ${BUNDLE_ITEMS.join(' · ')}`,
    `   Risparmio: €${(BUNDLE_FULL - BUNDLE_PRICE).toFixed(2)}`,
  ] : [];

  const grandTotal = total + (bundle ? BUNDLE_PRICE : 0);

  const body = [
    'NUOVO ORDINE — iPhone Ricondizionati',
    `Data: ${date}`,
    '',
    'DATI CLIENTE',
    `Nome e Cognome: ${customer.nome} ${customer.cognome}`,
    `Cellulare: ${customer.cellulare}`,
    `Email cliente: ${customer.email}`,
    `Sede: ${customer.sede}`,
    '',
    'PRODOTTI ORDINATI',
    '─────────────────────────────────',
    ...itemLines,
    ...bundleLines,
    '─────────────────────────────────',
    `TOTALE: €${grandTotal.toFixed(2)}`,
    '',
    'Inviato tramite app ordini iPhone Ricondizionati',
  ].join('\n');

  return `mailto:caly92@live.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function OrderForm({ cartItems, onOrderComplete }) {
  const [form, setForm]     = useState(initial);
  const [errors, setErrors] = useState({});
  const [bundle, setBundle] = useState(false);

  const itemsTotal  = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const grandTotal  = itemsTotal + (bundle ? BUNDLE_PRICE : 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    window.location.href = buildMailtoUrl(form, cartItems, itemsTotal, bundle);
    onOrderComplete({ customer: form, items: cartItems, total: grandTotal, bundle });
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

      {/* ── Bundle accessori ── */}
      <h2 className="section-title" style={{ marginTop: 8 }}>Accessori</h2>

      <div
        className={`bundle-card${bundle ? ' bundle-active' : ''}`}
        onClick={() => setBundle(b => !b)}
        role="checkbox"
        aria-checked={bundle}
        tabIndex={0}
        onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && setBundle(b => !b)}
      >
        <div className="bundle-check">
          <span className={`bundle-checkbox${bundle ? ' checked' : ''}`}>
            {bundle ? '✓' : ''}
          </span>
        </div>
        <div className="bundle-body">
          <div className="bundle-title-row">
            <span className="bundle-title">Bundle Accessori</span>
            <div className="bundle-pricing">
              <span className="bundle-old">€{BUNDLE_FULL}</span>
              <span className="bundle-price">€{BUNDLE_PRICE}</span>
            </div>
          </div>
          <ul className="bundle-list">
            {BUNDLE_ITEMS.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="bundle-saving">
            Risparmio di €{BUNDLE_FULL - BUNDLE_PRICE} acquistando il bundle completo
          </p>
        </div>
      </div>

      {/* ── Riepilogo ordine ── */}
      <h2 className="section-title" style={{ marginTop: 8 }}>Riepilogo Ordine</h2>

      <div className="form-summary">
        {cartItems.map(item => {
          const colorStr = (item.colors || [])
            .map(c => c === item.preferredColor ? `${c} ★` : c)
            .join(', ');
          return (
            <div key={item.cartKey} className="summary-line" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.model} {item.storage}{item.isNew ? ' (NUOVO)' : ''} × {item.qty}</span>
                <span>€{(item.price * item.qty).toFixed(2)}</span>
              </div>
              {colorStr && (
                <span style={{ fontSize: 11, color: '#6e6e73', marginTop: 2 }}>{colorStr}</span>
              )}
            </div>
          );
        })}

        {bundle && (
          <div className="summary-line summary-bundle-line">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bundle Accessori</span>
              <span>€{BUNDLE_PRICE}.00</span>
            </div>
            <span style={{ fontSize: 11, color: '#6e6e73', marginTop: 2 }}>
              {BUNDLE_ITEMS.join(' · ')}
            </span>
          </div>
        )}

        <div className="summary-total">
          <span>Totale</span>
          <span>€{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <p className="email-notice">
        📧 Alla conferma si aprirà il tuo client di posta con l'ordine pronto da inviare a <strong>caly92@live.it</strong>
      </p>

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
