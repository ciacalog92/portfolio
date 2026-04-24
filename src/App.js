import React, { useState } from 'react';
import './App.css';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState('catalog'); // 'catalog' | 'checkout' | 'done'

  function handleAdd(phone) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === phone.id);
      if (existing) {
        return prev.map(i => i.id === phone.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...phone, qty: 1 }];
    });
  }

  function handleRemove(id) {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  function handleQuantityChange(id, qty) {
    if (qty <= 0) {
      handleRemove(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function handleOrderComplete(order) {
    console.log('Ordine ricevuto:', order);
    setStep('done');
  }

  function handleReset() {
    setCartItems([]);
    setStep('catalog');
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">📱</span>
            <div>
              <h1 className="logo-title">iRicondizionati</h1>
              <p className="logo-sub">iPhone ricondizionati certificati</p>
            </div>
          </div>
          <nav className="header-nav">
            {step !== 'done' && (
              <>
                <button
                  className={`nav-btn ${step === 'catalog' ? 'active' : ''}`}
                  onClick={() => setStep('catalog')}
                >
                  Catalogo
                </button>
                <button
                  className={`nav-btn cart-nav-btn ${step === 'checkout' ? 'active' : ''} ${cartCount === 0 ? 'disabled' : ''}`}
                  onClick={() => cartCount > 0 && setStep('checkout')}
                  disabled={cartCount === 0}
                >
                  Ordine
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
              </>
            )}
            {step === 'done' && (
              <button className="nav-btn active" onClick={handleReset}>
                Nuovo ordine
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="main">
        {step === 'catalog' && (
          <div className="catalog-layout">
            <div className="catalog-col">
              <Catalog onAdd={handleAdd} />
            </div>
            <aside className="cart-col">
              <div className="cart-sticky">
                <Cart
                  items={cartItems}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                />
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
                <Cart
                  items={cartItems}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                />
                <button className="btn-back" onClick={() => setStep('catalog')}>
                  ← Torna al catalogo
                </button>
              </div>
            </aside>
          </div>
        )}

        {step === 'done' && (
          <div className="done-layout">
            <div className="order-success-wrap">
              <div className="success-icon-big">✅</div>
              <h2>Ordine confermato!</h2>
              <p>
                Abbiamo ricevuto il tuo ordine. Riceverai una email di conferma a breve.
              </p>
              <p className="success-total-big">Totale: <strong>€{cartTotal.toFixed(2)}</strong></p>
              <button className="btn-submit" onClick={handleReset}>
                Effettua un nuovo ordine
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 iRicondizionati · Tutti i prezzi IVA inclusa · Garanzia 12 mesi su tutti i dispositivi</p>
      </footer>
    </div>
  );
}
