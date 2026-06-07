(function () {
  'use strict';

  var STORAGE_KEY = 'igroup_orders_v1';

  function loadOrders() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders(orders) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {}
  }

  function parseOrderBody(text) {
    var lines = text.split('\n');
    var order = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      savedAt: new Date().toISOString(),
      date: '',
      customer: { nome: '', cognome: '', cellulare: '', email: '', sede: '' },
      items: [],
      bundle: null,
      total: 0
    };

    var section = '';
    var currentItem = null;
    var bundleItems = null;

    function pushItem() {
      if (currentItem) order.items.push(currentItem);
      currentItem = null;
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      if (line.indexOf('Data: ') === 0) {
        order.date = line.slice(6).trim();
        continue;
      }
      if (trimmed === 'DATI CLIENTE') { section = 'customer'; continue; }
      if (trimmed === 'PRODOTTI ORDINATI') { section = 'items'; continue; }
      if (trimmed.indexOf('BUNDLE ACCESSORI') === 0) {
        pushItem();
        section = 'bundle';
        order.bundle = { label: trimmed, items: [], saving: '' };
        continue;
      }
      if (trimmed.indexOf('TOTALE:') === 0) {
        pushItem();
        var m = trimmed.match(/€\s*([\d.,]+)/);
        if (m) order.total = parseFloat(m[1].replace(',', '.')) || 0;
        section = '';
        continue;
      }

      if (section === 'customer') {
        if (line.indexOf('Nome e Cognome: ') === 0) {
          var full = line.slice(16).trim().split(' ');
          order.customer.nome = full.shift() || '';
          order.customer.cognome = full.join(' ');
        } else if (line.indexOf('Cellulare: ') === 0) {
          order.customer.cellulare = line.slice(11).trim();
        } else if (line.indexOf('Email cliente: ') === 0) {
          order.customer.email = line.slice(15).trim();
        } else if (line.indexOf('Sede: ') === 0) {
          order.customer.sede = line.slice(6).trim();
        }
      } else if (section === 'items') {
        var itemMatch = line.match(/^(\d+)\.\s+(.+?)\s{2}(\S+)(\s+\(NUOVO\))?\s{2}x(\d+)\s{2}→\s{2}€([\d.]+)\s*$/);
        if (itemMatch) {
          pushItem();
          currentItem = {
            model: itemMatch[2].trim(),
            storage: itemMatch[3],
            isNew: !!itemMatch[4],
            qty: parseInt(itemMatch[5], 10),
            lineTotal: parseFloat(itemMatch[6]),
            colors: ''
          };
        } else if (currentItem && line.indexOf('   Colori: ') === 0) {
          currentItem.colors = line.slice(11).trim();
        }
      } else if (section === 'bundle' && order.bundle) {
        if (line.indexOf('   Risparmio:') === 0) {
          order.bundle.saving = line.slice(3).trim();
        } else if (line.indexOf('   ') === 0 && trimmed) {
          order.bundle.items.push(trimmed);
        }
      }
    }
    pushItem();
    return order;
  }

  var origEncode = window.encodeURIComponent;
  window.encodeURIComponent = function (input) {
    try {
      if (typeof input === 'string' && input.indexOf('NUOVO ORDINE') === 0 && input.indexOf('DATI CLIENTE') !== -1) {
        var order = parseOrderBody(input);
        var orders = loadOrders();
        orders.unshift(order);
        if (orders.length > 500) orders.length = 500;
        saveOrders(orders);
      }
    } catch (e) {}
    return origEncode.apply(this, arguments);
  };

  var STYLE = ''
    + '#oh-fab{position:fixed;right:16px;bottom:16px;z-index:99998;background:#0A84FF;color:#fff;'
    + 'border:none;border-radius:999px;padding:12px 16px;font-size:14px;font-weight:600;'
    + 'box-shadow:0 6px 20px rgba(10,132,255,.45);cursor:pointer;display:flex;align-items:center;gap:8px;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;}'
    + '#oh-fab:hover{background:#0a74e0}'
    + '#oh-fab .oh-badge{background:#fff;color:#0A84FF;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:700;min-width:16px;text-align:center}'
    + '#oh-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:99999;display:none;'
    + 'align-items:flex-start;justify-content:center;padding:24px 12px;overflow:auto;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;}'
    + '#oh-overlay.oh-open{display:flex}'
    + '#oh-modal{background:#1c1c1e;color:#fff;border-radius:16px;width:100%;max-width:720px;'
    + 'box-shadow:0 30px 60px rgba(0,0,0,.6);overflow:hidden}'
    + '.oh-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;'
    + 'border-bottom:1px solid #2c2c2e}'
    + '.oh-head h2{margin:0;font-size:18px;font-weight:600}'
    + '.oh-head-actions{display:flex;gap:8px}'
    + '.oh-btn{background:#2c2c2e;color:#fff;border:none;border-radius:8px;padding:8px 12px;'
    + 'font-size:13px;font-weight:500;cursor:pointer}'
    + '.oh-btn:hover{background:#3a3a3c}'
    + '.oh-btn.oh-danger{background:#3a1c1f;color:#ff6b6b}'
    + '.oh-btn.oh-danger:hover{background:#5a2026}'
    + '.oh-btn.oh-close{background:transparent;font-size:22px;padding:4px 10px}'
    + '.oh-body{max-height:75vh;overflow:auto;padding:8px 12px 16px}'
    + '.oh-empty{padding:40px 20px;text-align:center;color:#8e8e93}'
    + '.oh-card{background:#2c2c2e;border-radius:12px;margin:8px;padding:14px 16px}'
    + '.oh-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;cursor:pointer}'
    + '.oh-card-title{font-weight:600;font-size:15px;margin:0 0 4px}'
    + '.oh-card-meta{font-size:12px;color:#8e8e93;line-height:1.5}'
    + '.oh-card-total{font-weight:700;font-size:16px;color:#0A84FF;white-space:nowrap}'
    + '.oh-card-detail{display:none;margin-top:12px;padding-top:12px;border-top:1px solid #3a3a3c;'
    + 'font-size:13px;line-height:1.6}'
    + '.oh-card.oh-expanded .oh-card-detail{display:block}'
    + '.oh-sec{margin-top:10px}'
    + '.oh-sec-title{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#8e8e93;margin-bottom:4px;font-weight:600}'
    + '.oh-item-row{display:flex;justify-content:space-between;gap:8px;padding:4px 0}'
    + '.oh-item-row .oh-tag-new{background:#0A84FF;color:#fff;font-size:10px;padding:1px 6px;border-radius:4px;margin-left:6px;vertical-align:middle}'
    + '.oh-item-colors{font-size:12px;color:#8e8e93;margin-left:4px}'
    + '.oh-card-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}'
    + '.oh-link{color:#0A84FF;text-decoration:none;word-break:break-all}'
    + '@media (max-width:520px){#oh-fab{right:12px;bottom:84px}.oh-head h2{font-size:16px}}';

  function injectStyle() {
    var s = document.createElement('style');
    s.id = 'oh-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderOrderDetail(o) {
    var itemsHtml = (o.items || []).map(function (it) {
      var qty = it.qty || 1;
      var price = (it.lineTotal != null ? it.lineTotal : 0).toFixed(2);
      var newTag = it.isNew ? '<span class="oh-tag-new">NUOVO</span>' : '';
      var colors = it.colors ? '<div class="oh-item-colors">Colori: ' + escapeHtml(it.colors) + '</div>' : '';
      return '<div class="oh-item-row"><div>'
        + escapeHtml(it.model || '') + ' '
        + escapeHtml(it.storage || '') + newTag
        + ' &times;' + qty + colors
        + '</div><div>&euro;' + price + '</div></div>';
    }).join('');

    var bundleHtml = '';
    if (o.bundle) {
      bundleHtml = '<div class="oh-sec"><div class="oh-sec-title">Bundle accessori</div>'
        + '<div>' + escapeHtml((o.bundle.items || []).join(' · ')) + '</div>'
        + (o.bundle.saving ? '<div class="oh-item-colors">' + escapeHtml(o.bundle.saving) + '</div>' : '')
        + '</div>';
    }

    var c = o.customer || {};
    var phoneLink = c.cellulare ? '<a class="oh-link" href="tel:' + escapeHtml(c.cellulare.replace(/\s+/g, '')) + '">' + escapeHtml(c.cellulare) + '</a>' : '';
    var mailLink = c.email ? '<a class="oh-link" href="mailto:' + escapeHtml(c.email) + '">' + escapeHtml(c.email) + '</a>' : '';

    return '<div class="oh-card-detail">'
      + '<div class="oh-sec"><div class="oh-sec-title">Cliente</div>'
      + '<div><strong>' + escapeHtml((c.nome || '') + ' ' + (c.cognome || '')) + '</strong></div>'
      + (phoneLink ? '<div>Tel: ' + phoneLink + '</div>' : '')
      + (mailLink ? '<div>Email: ' + mailLink + '</div>' : '')
      + (c.sede ? '<div>Sede: ' + escapeHtml(c.sede) + '</div>' : '')
      + '</div>'
      + '<div class="oh-sec"><div class="oh-sec-title">Prodotti</div>' + itemsHtml + '</div>'
      + bundleHtml
      + '<div class="oh-card-actions">'
      + '<button class="oh-btn oh-danger" data-act="delete" data-id="' + escapeHtml(o.id) + '">Elimina ordine</button>'
      + '</div></div>';
  }

  function renderOrders() {
    var body = document.getElementById('oh-body');
    var orders = loadOrders();
    var badge = document.getElementById('oh-badge');
    if (badge) badge.textContent = orders.length;
    if (!body) return;

    if (orders.length === 0) {
      body.innerHTML = '<div class="oh-empty">Nessun ordine salvato ancora.<br><small>Gli ordini verranno registrati qui in automatico quando confermi un acquisto.</small></div>';
      return;
    }

    body.innerHTML = orders.map(function (o) {
      var c = o.customer || {};
      var name = ((c.nome || '') + ' ' + (c.cognome || '')).trim() || 'Cliente';
      var totalStr = (o.total || 0).toFixed(2);
      var itemsCount = (o.items || []).reduce(function (acc, it) { return acc + (it.qty || 1); }, 0);
      return '<div class="oh-card" data-id="' + escapeHtml(o.id) + '">'
        + '<div class="oh-card-head" data-act="toggle">'
        + '<div>'
        + '<div class="oh-card-title">' + escapeHtml(name) + '</div>'
        + '<div class="oh-card-meta">' + escapeHtml(o.date || '') + (c.sede ? ' &middot; ' + escapeHtml(c.sede) : '') + '</div>'
        + '<div class="oh-card-meta">' + itemsCount + ' articol' + (itemsCount === 1 ? 'o' : 'i') + '</div>'
        + '</div>'
        + '<div class="oh-card-total">&euro;' + totalStr + '</div>'
        + '</div>'
        + renderOrderDetail(o)
        + '</div>';
    }).join('');
  }

  function open() {
    var ov = document.getElementById('oh-overlay');
    if (ov) { renderOrders(); ov.classList.add('oh-open'); }
  }
  function close() {
    var ov = document.getElementById('oh-overlay');
    if (ov) ov.classList.remove('oh-open');
  }

  function exportJson() {
    var orders = loadOrders();
    var blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ordini-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function build() {
    if (document.getElementById('oh-fab')) return;
    injectStyle();

    var fab = document.createElement('button');
    fab.id = 'oh-fab';
    fab.type = 'button';
    fab.innerHTML = '<span>Storico ordini</span><span class="oh-badge" id="oh-badge">0</span>';
    fab.addEventListener('click', open);
    document.body.appendChild(fab);

    var overlay = document.createElement('div');
    overlay.id = 'oh-overlay';
    overlay.innerHTML = ''
      + '<div id="oh-modal" role="dialog" aria-modal="true">'
      + '<div class="oh-head">'
      + '<h2>Storico ordini</h2>'
      + '<div class="oh-head-actions">'
      + '<button class="oh-btn" data-act="export">Esporta JSON</button>'
      + '<button class="oh-btn oh-danger" data-act="clear">Svuota</button>'
      + '<button class="oh-btn oh-close" data-act="close" aria-label="Chiudi">&times;</button>'
      + '</div></div>'
      + '<div class="oh-body" id="oh-body"></div>'
      + '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) return close();
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!act) {
        var p = e.target.closest && e.target.closest('[data-act]');
        if (p) act = p.getAttribute('data-act');
      }
      if (act === 'close') return close();
      if (act === 'clear') {
        if (confirm('Eliminare tutti gli ordini salvati?')) {
          saveOrders([]);
          renderOrders();
        }
        return;
      }
      if (act === 'export') return exportJson();
      if (act === 'delete') {
        var id = (e.target.closest('[data-id]') || {}).getAttribute && e.target.closest('[data-id]').getAttribute('data-id');
        if (id && confirm('Eliminare questo ordine?')) {
          saveOrders(loadOrders().filter(function (o) { return o.id !== id; }));
          renderOrders();
        }
        return;
      }
      if (act === 'toggle') {
        var card = e.target.closest('.oh-card');
        if (card) card.classList.toggle('oh-expanded');
      }
    });
    document.body.appendChild(overlay);

    renderOrders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
