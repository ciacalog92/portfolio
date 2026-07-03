/*
 * Prodotti singoli scontati (regola "PROMO ACCESSORI" del volantino) + campo Note.
 * Integra il flusso ordine esistente senza modificarne la logica React:
 *  - inietta una sezione nel form ordine (prodotti singoli + note);
 *  - al momento della conferma, aggiunge le righe al corpo dell'email e
 *    ricalcola il TOTALE, prima che lo storico ordini lo registri.
 * Il bundle esistente resta invariato.
 */
(function () {
  'use strict';

  // Prezzi promo (prezzo scontato) da volantino "PROMO ACCESSORI".
  var PRODUCTS = [
    { id: 'travelset', name: 'Travel Set (Type-C/Lightning · Type-C/Type-C)', orig: 34.90, price: 24.90 },
    { id: 'cover_mag', name: 'Cover Magnetic/MagSafe', orig: 30, price: 20 },
    { id: 'cover_tpu', name: 'Cover TPU', orig: 20, price: 10 },
    { id: 'glass', name: 'Glass — Vetro temperato', orig: 20, price: 15 },
    { id: 'cam', name: 'Protezione Fotocamere', orig: 19.90, price: 14.90 }
  ];
  // Passaggio dati: add-on a €5 (non scontato), come da volantino.
  var DATA_TRANSFER = { id: 'dati', name: 'Passaggio dati', price: 5 };

  var state = { qty: {}, dati: false, note: '' };
  var sectionEl = null;

  function euro(n) {
    return '€' + Number(n).toFixed(2).replace('.', ',');
  }

  // Formato importi per il corpo email, coerente con le altre righe dell'app (punto decimale).
  function euroMail(n) {
    return '€' + Number(n).toFixed(2);
  }

  function singlesSubtotal() {
    var s = 0;
    PRODUCTS.forEach(function (p) { s += (state.qty[p.id] || 0) * p.price; });
    if (state.dati) s += DATA_TRANSFER.price;
    return s;
  }

  function hasSelection() {
    return singlesSubtotal() > 0 || (state.note && state.note.trim());
  }

  function resetState() {
    state.qty = {};
    state.dati = false;
    state.note = '';
  }

  function readAppTotal() {
    var el = document.querySelector('.summary-total');
    if (!el) return null;
    var m = (el.textContent || '').match(/([\d]+(?:[.,]\d{1,2})?)\s*$/);
    if (!m) return null;
    return parseFloat(m[1].replace(',', '.'));
  }

  /* ---------- corpo email + storico ---------- */

  function buildInjectionLines() {
    var lines = [];
    var selected = PRODUCTS.filter(function (p) { return (state.qty[p.id] || 0) > 0; });
    if (selected.length || state.dati) {
      lines.push('');
      lines.push('PRODOTTI SINGOLI SCONTATI');
      var n = 0;
      selected.forEach(function (p) {
        n++;
        var qty = state.qty[p.id];
        lines.push('   ' + n + '. ' + p.name + '  x' + qty + '  →  ' + euroMail(p.price * qty));
      });
      if (state.dati) {
        lines.push('   ' + DATA_TRANSFER.name + '  x1  →  ' + euroMail(DATA_TRANSFER.price));
      }
    }
    if (state.note && state.note.trim()) {
      lines.push('');
      lines.push('NOTE ORDINE');
      state.note.replace(/\r\n?/g, '\n').trim().split('\n').forEach(function (l) {
        lines.push('   ' + l.trim());
      });
    }
    return lines;
  }

  function augmentBody(body) {
    var extra = singlesSubtotal();
    var inject = buildInjectionLines();
    if (!inject.length && extra === 0) return body;

    var lines = body.split('\n');
    var ti = -1;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('TOTALE:') === 0) { ti = i; break; }
    }
    if (ti === -1) return body;

    // Il separatore di ─ subito sopra il TOTALE: inseriamo le sezioni prima di esso.
    var insertAt = ti;
    if (insertAt > 0 && /^─+$/.test(lines[insertAt - 1])) insertAt = insertAt - 1;

    var head = lines.slice(0, insertAt);
    var tail = lines.slice(insertAt);
    var merged = head.concat(inject, tail);

    // Ricalcola il TOTALE aggiungendo i prodotti singoli.
    for (var j = 0; j < merged.length; j++) {
      if (merged[j].indexOf('TOTALE:') === 0) {
        var m = merged[j].match(/€\s*([\d.,]+)/);
        var base = m ? parseFloat(m[1].replace(',', '.')) : 0;
        merged[j] = 'TOTALE: €' + (base + extra).toFixed(2);
        break;
      }
    }
    return merged.join('\n');
  }

  var origEncode = window.encodeURIComponent;
  window.encodeURIComponent = function (input) {
    if (typeof input === 'string' && input.indexOf('NUOVO ORDINE') === 0 && input.indexOf('DATI CLIENTE') !== -1) {
      try {
        var augmented = augmentBody(input);
        var result = origEncode.call(this, augmented);
        // Reset dopo l'invio ordine.
        resetState();
        render();
        return result;
      } catch (e) {
        return origEncode.apply(this, arguments);
      }
    }
    return origEncode.apply(this, arguments);
  };

  /* ---------- UI ---------- */

  var STYLE = ''
    + '.pa-section{background:#fff;border:1px solid #e5e5ea;border-radius:14px;padding:18px 20px;margin-bottom:20px}'
    + '.pa-title{font-size:15px;font-weight:700;letter-spacing:-.2px;margin:0 0 4px;color:#1d1d1f}'
    + '.pa-sub{font-size:12px;color:#6e6e73;margin:0 0 14px}'
    + '.pa-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid #f0f0f2}'
    + '.pa-row:first-of-type{border-top:none}'
    + '.pa-info{flex:1;min-width:0}'
    + '.pa-name{font-size:14px;color:#1d1d1f;line-height:1.3}'
    + '.pa-price{font-size:12px;color:#6e6e73;margin-top:2px}'
    + '.pa-old{text-decoration:line-through;margin-right:6px}'
    + '.pa-promo{color:#0071e3;font-weight:600}'
    + '.pa-stepper{display:flex;align-items:center;gap:10px;flex-shrink:0}'
    + '.pa-btn{width:30px;height:30px;border-radius:50%;border:1px solid #d2d2d7;background:#f5f5f7;'
    + 'font-size:18px;line-height:1;color:#1d1d1f;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}'
    + '.pa-btn:hover{background:#ececef}'
    + '.pa-btn:disabled{opacity:.4;cursor:default}'
    + '.pa-qty{min-width:20px;text-align:center;font-size:15px;font-weight:600}'
    + '.pa-line{font-size:13px;font-weight:600;color:#1d1d1f;min-width:60px;text-align:right}'
    + '.pa-dati{display:flex;align-items:center;gap:10px;padding:12px 0 2px;border-top:1px solid #f0f0f2;margin-top:4px}'
    + '.pa-dati input{width:18px;height:18px;accent-color:#0071e3}'
    + '.pa-dati label{font-size:14px;color:#1d1d1f;cursor:pointer}'
    + '.pa-subtotal{display:flex;justify-content:space-between;font-size:14px;font-weight:700;'
    + 'margin-top:12px;padding-top:12px;border-top:2px solid #e5e5ea;color:#1d1d1f}'
    + '.pa-combined{display:flex;justify-content:space-between;font-size:13px;color:#6e6e73;margin-top:6px}'
    + '.pa-note-wrap{margin-top:16px}'
    + '.pa-note-label{font-size:13px;font-weight:600;color:#1d1d1f;display:block;margin-bottom:6px}'
    + '.pa-note{width:100%;box-sizing:border-box;border:1px solid #d2d2d7;border-radius:10px;padding:10px 12px;'
    + 'font-size:14px;font-family:inherit;resize:vertical;min-height:64px;color:#1d1d1f;background:#fff}'
    + '.pa-note:focus{outline:none;border-color:#0071e3}';

  function injectStyle() {
    if (document.getElementById('pa-style')) return;
    var s = document.createElement('style');
    s.id = 'pa-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function changeQty(id, delta) {
    var cur = state.qty[id] || 0;
    cur += delta;
    if (cur < 0) cur = 0;
    if (cur > 99) cur = 99;
    if (cur === 0) delete state.qty[id];
    else state.qty[id] = cur;
    render();
  }

  function build() {
    injectStyle();
    var sec = document.createElement('div');
    sec.className = 'pa-section';
    sec.id = 'pa-section';

    var html = ''
      + '<h2 class="pa-title">Prodotti singoli scontati</h2>'
      + '<p class="pa-sub">Prezzi promo dedicati — acquistabili anche senza bundle.</p>';

    PRODUCTS.forEach(function (p) {
      html += '<div class="pa-row" data-id="' + p.id + '">'
        + '<div class="pa-info">'
        + '<div class="pa-name">' + p.name + '</div>'
        + '<div class="pa-price"><span class="pa-old">' + euro(p.orig) + '</span>'
        + '<span class="pa-promo">' + euro(p.price) + '</span></div>'
        + '</div>'
        + '<div class="pa-stepper">'
        + '<button type="button" class="pa-btn" data-act="minus" data-id="' + p.id + '" aria-label="Rimuovi">−</button>'
        + '<span class="pa-qty" data-qty="' + p.id + '">0</span>'
        + '<button type="button" class="pa-btn" data-act="plus" data-id="' + p.id + '" aria-label="Aggiungi">+</button>'
        + '</div>'
        + '<div class="pa-line" data-line="' + p.id + '">' + euro(0) + '</div>'
        + '</div>';
    });

    html += '<div class="pa-dati">'
      + '<input type="checkbox" id="pa-dati-chk">'
      + '<label for="pa-dati-chk">Passaggio dati (+' + euro(DATA_TRANSFER.price) + ')</label>'
      + '</div>'
      + '<div class="pa-subtotal"><span>Subtotale accessori singoli</span><span data-sub>' + euro(0) + '</span></div>'
      + '<div class="pa-combined" data-combined style="display:none"></div>'
      + '<div class="pa-note-wrap">'
      + '<label class="pa-note-label" for="pa-note">Note ordine</label>'
      + '<textarea id="pa-note" class="pa-note" placeholder="Es. colore preferito, orario ritiro, richieste particolari…"></textarea>'
      + '</div>';

    sec.innerHTML = html;

    sec.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      changeQty(id, btn.getAttribute('data-act') === 'plus' ? 1 : -1);
    });
    var chk = sec.querySelector('#pa-dati-chk');
    chk.addEventListener('change', function () { state.dati = chk.checked; render(); });
    var note = sec.querySelector('#pa-note');
    note.addEventListener('input', function () { state.note = note.value; render(); });

    return sec;
  }

  function render() {
    if (!sectionEl) return;
    PRODUCTS.forEach(function (p) {
      var qty = state.qty[p.id] || 0;
      var q = sectionEl.querySelector('[data-qty="' + p.id + '"]');
      var line = sectionEl.querySelector('[data-line="' + p.id + '"]');
      var row = sectionEl.querySelector('.pa-row[data-id="' + p.id + '"]');
      if (q) q.textContent = qty;
      if (line) line.textContent = euro(qty * p.price);
      if (row) row.style.background = qty > 0 ? '#f0f7ff' : '';
    });
    var chk = sectionEl.querySelector('#pa-dati-chk');
    if (chk) chk.checked = state.dati;
    var note = sectionEl.querySelector('#pa-note');
    if (note && note.value !== state.note) note.value = state.note;

    var sub = singlesSubtotal();
    var subEl = sectionEl.querySelector('[data-sub]');
    if (subEl) subEl.textContent = euro(sub);

    var combined = sectionEl.querySelector('[data-combined]');
    if (combined) {
      var appTotal = readAppTotal();
      if (sub > 0 && appTotal != null) {
        combined.style.display = 'flex';
        combined.innerHTML = '<span>Totale ordine completo</span><span>' + euro(appTotal + sub) + '</span>';
      } else {
        combined.style.display = 'none';
      }
    }
  }

  /* ---------- watchdog: mantiene la sezione dentro il form ordine ---------- */

  function ensureMounted() {
    var form = document.querySelector('.order-form');
    if (!form) {
      // Fuori dalla pagina ordine: lascia la sezione staccata (lo stato resta in memoria).
      return;
    }
    if (!sectionEl) sectionEl = build();
    if (sectionEl.parentNode) return; // già montata

    var anchor = null;
    var titles = form.querySelectorAll('.section-title');
    for (var i = 0; i < titles.length; i++) {
      if ((titles[i].textContent || '').indexOf('Riepilogo') !== -1) { anchor = titles[i]; break; }
    }
    if (anchor) form.insertBefore(sectionEl, anchor);
    else form.appendChild(sectionEl);
    render();
  }

  function start() {
    ensureMounted();
    var obs = new MutationObserver(function () { ensureMounted(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
