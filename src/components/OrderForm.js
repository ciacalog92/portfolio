import React, { useState } from 'react';

const initialForm = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  indirizzo: '',
  citta: '',
  cap: '',
  provincia: '',
  note: '',
  pagamento: 'bonifico',
};

function validate(form) {
  const errors = {};
  if (!form.nome.trim()) errors.nome = 'Il nome è obbligatorio';
  if (!form.cognome.trim()) errors.cognome = 'Il cognome è obbligatorio';
  if (!form.email.trim()) errors.email = "L'email è obbligatoria";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Email non valida';
  if (!form.telefono.trim()) errors.telefono = 'Il telefono è obbligatorio';
  else if (!/^[\d\s\+\-]{6,15}$/.test(form.telefono))
    errors.telefono = 'Numero non valido';
  if (!form.indirizzo.trim()) errors.indirizzo = "L'indirizzo è obbligatorio";
  if (!form.citta.trim()) errors.citta = 'La città è obbligatoria';
  if (!form.cap.trim()) errors.cap = 'Il CAP è obbligatorio';
  else if (!/^\d{5}$/.test(form.cap)) errors.cap = 'CAP non valido (5 cifre)';
  if (!form.provincia.trim()) errors.provincia = 'La provincia è obbligatoria';
  return errors;
}

export default function OrderForm({ cartItems, onOrderComplete }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    onOrderComplete({ customer: form, items: cartItems, total, date: new Date().toISOString() });
  }

  if (submitted) {
    return (
      <div className="order-success">
        <div className="success-icon">✅</div>
        <h2>Ordine inviato con successo!</h2>
        <p>
          Grazie <strong>{form.nome} {form.cognome}</strong>! Riceverai una conferma
          all'indirizzo <strong>{form.email}</strong>.
        </p>
        <p className="success-total">Totale ordine: <strong>€{total.toFixed(2)}</strong></p>
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">Dati Cliente</h2>

      <div className="form-row">
        <Field label="Nome *" error={errors.nome}>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Mario" />
        </Field>
        <Field label="Cognome *" error={errors.cognome}>
          <input name="cognome" value={form.cognome} onChange={handleChange} placeholder="Rossi" />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Email *" error={errors.email}>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="mario.rossi@email.it" />
        </Field>
        <Field label="Telefono *" error={errors.telefono}>
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+39 333 1234567" />
        </Field>
      </div>

      <h2 className="section-title">Indirizzo di Spedizione</h2>

      <Field label="Indirizzo *" error={errors.indirizzo}>
        <input name="indirizzo" value={form.indirizzo} onChange={handleChange} placeholder="Via Roma 1" />
      </Field>

      <div className="form-row form-row-3">
        <Field label="Città *" error={errors.citta}>
          <input name="citta" value={form.citta} onChange={handleChange} placeholder="Milano" />
        </Field>
        <Field label="CAP *" error={errors.cap}>
          <input name="cap" value={form.cap} onChange={handleChange} placeholder="20100" maxLength={5} />
        </Field>
        <Field label="Provincia *" error={errors.provincia}>
          <input name="provincia" value={form.provincia} onChange={handleChange} placeholder="MI" maxLength={2} style={{ textTransform: 'uppercase' }} />
        </Field>
      </div>

      <h2 className="section-title">Metodo di Pagamento</h2>

      <div className="payment-options">
        {[
          { value: 'bonifico', label: 'Bonifico Bancario' },
          { value: 'carta', label: 'Carta di Credito/Debito' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'contrassegno', label: 'Contrassegno (+€5)' },
        ].map(opt => (
          <label key={opt.value} className={`payment-option ${form.pagamento === opt.value ? 'selected' : ''}`}>
            <input
              type="radio"
              name="pagamento"
              value={opt.value}
              checked={form.pagamento === opt.value}
              onChange={handleChange}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <Field label="Note aggiuntive">
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Istruzioni per la consegna, richieste particolari..."
          rows={3}
        />
      </Field>

      <div className="form-summary">
        <div className="summary-items">
          {cartItems.map(item => (
            <div key={item.id} className="summary-line">
              <span>{item.model} {item.storage} {item.color} × {item.qty}</span>
              <span>€{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          {form.pagamento === 'contrassegno' && (
            <div className="summary-line">
              <span>Supplemento contrassegno</span>
              <span>€5.00</span>
            </div>
          )}
        </div>
        <div className="summary-total">
          <span>Totale</span>
          <span>€{(total + (form.pagamento === 'contrassegno' ? 5 : 0)).toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Conferma Ordine →
      </button>
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
