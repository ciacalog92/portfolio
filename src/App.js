import React, { useState } from 'react';
import './App.css';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState('catalog');
  const [completedOrder, setCompletedOrder] = useState(null);

  function handleAdd(phone) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === phone.id);
      if (existing) return prev.map(i => i.id === phone.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...phone, qty: 1 }];
    });
  }

  function handleRemove(id) {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  function handleQuantityChange(id, qty) {
    if (qty <= 0) { handleRemove(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function handleOrderComplete(order) {
    setCompletedOrder(order);
    setStep('done');
  }

  function handleReset() {
    setCartItems([]);
    setCompletedOrder(null);
    setStep('catalog');
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">📱</span>
            <div>
              <h1 className="logo-title">iPhone Ricondizionati</h1>
              <p className="logo-sub">Garanzia 12 mesi · 3 mesi batteria</p>
            </div>
          </div>
          <nav className="header-nav">
            {step !== 'done' && (
              <>
                <button className={`nav-btn ${step === 'catalog' ? 'active' : ''}`} onClick={() => setStep('catalog')}>
                  Catalogo
                </button>
                <button
                  className={`nav-btn cart-nav-btn ${step === 'checkout' ? 'active' : ''}`}
                  onClick={() => cartCount > 0 && setStep('checkout')}
                  disabled={cartCount === 0}
                >
                  Ordine
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
              </>
            )}
            {step === 'done' && (
              <button className="nav-btn active" onClick={handleReset}>+ Nuovo ordine</button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {step === 'catalog' && (
          <div className="catalog-layout">
            <div className="catalog-col">
              <Catalog onAdd={handleAdd} />
            </div>
            <aside className="cart-col">
              <div className="cart-sticky">
                <Cart items={cartItems} onRemove={handleRemove} onQuantityChange={handleQuantityChange} />
                {cartItems.length > 0 && (
                  <button className="btn-checkout" onClick={() => setStep('checkout')}>
                    Procedi all'ordine →
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}

        {step === 'checkout' && (
          <div className="checkout-layout">
            <div className="form-col">
              <OrderForm cartItems={cartItems} onOrderComplete={handleOrderComplete} />
            </div>
            <aside className="cart-col">
              <div className="cart-sticky">
                <Cart items={cartItems} onRemove={handleRemove} onQuantityChange={handleQuantityChange} />
                <button className="btn-back" onClick={() => setStep('catalog')}>← Torna al catalogo</button>
              </div>
            </aside>
          </div>
        )}

        {step === 'done' && completedOrder && (
          <div className="done-layout">
            <div className="order-success-wrap">
              <div className="success-icon-big">✅</div>
              <h2>Ordine confermato!</h2>
              <p>
                Cliente: <strong>{completedOrder.customer.nome} {completedOrder.customer.cognome}</strong>
              </p>
              <p>Sede: <strong>{completedOrder.customer.sede}</strong></p>
              <p>Email: <strong>{completedOrder.customer.email}</strong></p>
              <p>Cellulare: <strong>{completedOrder.customer.cellulare}</strong></p>

              <div className="done-items">
                {completedOrder.items.map(item => (
                  <div key={item.id} className="done-item-line">
                    <span>{item.model} {item.storage} × {item.qty}</span>
                    <span>€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="done-total">
                  <span>Totale</span>
                  <span>€{completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <button className="btn-submit" style={{ marginTop: 28 }} onClick={handleReset}>
                + Nuovo ordine
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Listino prezzi aggiornato · Garanzia 12 mesi telefono + 3 mesi batteria · IVA inclusa</p>
      </footer>
    </div>
  );
}
