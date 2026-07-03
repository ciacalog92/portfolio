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

  /* ---------- Supabase (fonte dati condivisa; localStorage = cache offline) ---------- */

  var SB_URL = 'https://veirkdcidicngnbomgel.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaXJrZGNpZGljbmduYm9tZ2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwODU0OTAsImV4cCI6MjA5ODY2MTQ5MH0.kjrSrlCNIZg9B7luoMwttCFeQy3GhoN-XY_SEfBqfnE';
  var SB_REST = SB_URL + '/rest/v1/ordini';

  function sbEnabled() { return typeof window.fetch === 'function'; }

  function sbHeaders(extra) {
    var h = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  function isUuid(id) {
    return typeof id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }

  function orderToRow(o) {
    var c = o.customer || {};
    return {
      order_date: o.date || '',
      customer_nome: c.nome || '',
      customer_cognome: c.cognome || '',
      customer_cellulare: c.cellulare || '',
      customer_email: c.email || '',
      sede: c.sede || '',
      total: (o.total != null ? o.total : 0),
      data: o
    };
  }

  function rowToOrder(r) {
    var o = {};
    var d = r.data || {};
    for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) o[k] = d[k];
    o.id = r.id;                       // uuid del DB, usato per elimina/sync
    o.date = r.order_date || o.date || '';
    o.total = (r.total != null ? r.total : o.total);
    o.savedAt = r.created_at || o.savedAt;
    return o;
  }

  // Sincronizzazione unificata: prima carica sul DB gli ordini locali non ancora
  // sincronizzati (id non-uuid: cache pre-esistente o ordini creati offline),
  // poi scarica la lista autorevole e aggiorna cache + UI.
  // Un lock evita run concorrenti; gli ordini aggiunti durante un sync in corso
  // vengono preservati e ripresi al giro successivo.
  var _syncing = false, _syncQueued = false;

  function pullRemote(pushedIds, cb) {
    window.fetch(SB_REST + '?select=*&order=created_at.desc&limit=1000', { headers: sbHeaders() })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
      .then(function (rows) {
        var remote = (rows || []).map(rowToOrder);
        // Preserva gli ordini locali non-uuid non ancora inviati (aggiunti dopo lo snapshot).
        var extra = loadOrders().filter(function (o) {
          return !isUuid(o.id) && pushedIds.indexOf(o.id) === -1;
        });
        saveOrders(extra.concat(remote));
        renderOrders();
        cb(true);
      })
      .catch(function () { cb(false); });
  }

  function syncNow(cb) {
    if (!sbEnabled()) { if (cb) cb(false); return; }
    if (_syncing) { _syncQueued = true; if (cb) cb(false); return; }
    _syncing = true;

    var pending = loadOrders().filter(function (o) { return !isUuid(o.id); });
    var pushedIds = pending.map(function (o) { return o.id; });

    var done = function (ok) {
      _syncing = false;
      if (_syncQueued) { _syncQueued = false; syncNow(); }
      if (cb) cb(ok);
    };

    if (pending.length) {
      // Invio in blocco (dal più vecchio) così l'ordine cronologico si conserva.
      var payload = pending.slice().reverse().map(orderToRow);
      window.fetch(SB_REST, {
        method: 'POST', headers: sbHeaders({ Prefer: 'return=minimal' }), body: JSON.stringify(payload)
      })
        .then(function (r) {
          if (r.ok) pullRemote(pushedIds, done);
          else done(false);          // errore server: tieni gli ordini in sospeso, riprova dopo
        })
        .catch(function () { done(false); });   // offline: idem
    } else {
      pullRemote([], done);
    }
  }

  function sbDelete(id, cb) {
    if (!sbEnabled()) { if (cb) cb(false); return; }
    window.fetch(SB_REST + '?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE', headers: sbHeaders({ Prefer: 'return=minimal' })
    })
      .then(function (r) { if (cb) cb(r.ok); })
      .catch(function () { if (cb) cb(false); });
  }

  function sbClear(cb) {
    if (!sbEnabled()) { if (cb) cb(false); return; }
    window.fetch(SB_REST + '?id=not.is.null', {
      method: 'DELETE', headers: sbHeaders({ Prefer: 'return=minimal' })
    })
      .then(function (r) { if (cb) cb(r.ok); })
      .catch(function () { if (cb) cb(false); });
  }

  function parseOrderBody(text) {
    var lines = text.split('\n');
    var order = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      savedAt: new Date().toISOString(),
      date: '',
      customer: { nome: '', cognome: '', cellulare: '', email: '', sede: '' },
      items: [],
      singles: [],
      bundle: null,
      notes: '',
      total: 0
    };
    var noteLines = [];

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
      if (trimmed === 'PRODOTTI SINGOLI SCONTATI') { pushItem(); section = 'singles'; continue; }
      if (trimmed === 'NOTE ORDINE') { pushItem(); section = 'notes'; continue; }
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
      } else if (section === 'singles') {
        var sm = trimmed.match(/^(?:\d+\.\s+)?(.+?)\s+x(\d+)\s+→\s+€([\d.,]+)$/);
        if (sm) {
          order.singles.push({
            name: sm[1].trim(),
            qty: parseInt(sm[2], 10),
            lineTotal: parseFloat(sm[3].replace(',', '.'))
          });
        } else {
          var sm2 = trimmed.match(/^(.+?)\s+→\s+€([\d.,]+)$/);
          if (sm2) {
            order.singles.push({
              name: sm2[1].trim(),
              qty: 1,
              lineTotal: parseFloat(sm2[2].replace(',', '.'))
            });
          }
        }
      } else if (section === 'notes') {
        if (line.indexOf('   ') === 0 && trimmed) noteLines.push(trimmed);
      }
    }
    pushItem();
    order.notes = noteLines.join('\n');
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
        saveOrders(orders);        // cache locale immediata (feedback istantaneo / offline)
        syncNow();                 // invia al DB condiviso, poi ri-sincronizza
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

    var singlesHtml = '';
    if (o.singles && o.singles.length) {
      var rows = o.singles.map(function (it) {
        return '<div class="oh-item-row"><div>'
          + escapeHtml(it.name || '') + ' &times;' + (it.qty || 1)
          + '</div><div>&euro;' + (it.lineTotal != null ? it.lineTotal : 0).toFixed(2) + '</div></div>';
      }).join('');
      singlesHtml = '<div class="oh-sec"><div class="oh-sec-title">Accessori singoli scontati</div>' + rows + '</div>';
    }

    var notesHtml = '';
    if (o.notes) {
      notesHtml = '<div class="oh-sec"><div class="oh-sec-title">Note ordine</div>'
        + '<div style="white-space:pre-wrap">' + escapeHtml(o.notes) + '</div></div>';
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
      + singlesHtml
      + bundleHtml
      + notesHtml
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
    if (ov) { renderOrders(); ov.classList.add('oh-open'); syncNow(); }
  }
  function close() {
    var ov = document.getElementById('oh-overlay');
    if (ov) ov.classList.remove('oh-open');
  }

  /* ---------- export Excel (.xlsx nativo, senza dipendenze) ---------- */

  var CRC_TABLE = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function strBytes(s) { return new TextEncoder().encode(s); }

  // ZIP "stored" (nessuna compressione) dagli entry {name, bytes:Uint8Array}.
  function zipStore(entries) {
    function u16(v) { return [v & 0xFF, (v >>> 8) & 0xFF]; }
    function u32(v) { return [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]; }

    var parts = [];
    var central = [];
    var offset = 0;

    entries.forEach(function (e) {
      var nameBytes = strBytes(e.name);
      var crc = crc32(e.bytes);
      var size = e.bytes.length;

      var local = [].concat(
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(size), u32(size), u16(nameBytes.length), u16(0)
      );
      parts.push(new Uint8Array(local), nameBytes, e.bytes);

      var cen = [].concat(
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(size), u32(size), u16(nameBytes.length),
        u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)
      );
      central.push(new Uint8Array(cen), nameBytes);

      offset += local.length + nameBytes.length + size;
    });

    var centralStart = offset;
    var centralSize = central.reduce(function (n, a) { return n + a.length; }, 0);
    var eocd = new Uint8Array([].concat(
      u32(0x06054b50), u16(0), u16(0),
      u16(entries.length), u16(entries.length),
      u32(centralSize), u32(centralStart), u16(0)
    ));

    var all = parts.concat(central).concat([eocd]);
    var total = all.reduce(function (n, a) { return n + a.length; }, 0);
    var out = new Uint8Array(total);
    var pos = 0;
    all.forEach(function (a) { out.set(a, pos); pos += a.length; });
    return out;
  }

  function colLetter(n) {
    var s = '';
    n += 1;
    while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }

  function xmlEsc(s) {
    return String(s == null ? '' : s)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildXlsx(orders) {
    var headers = ['Data', 'Nome', 'Cognome', 'Cellulare', 'Email', 'Sede',
      'Dispositivi', 'Accessori singoli', 'Bundle', 'Note', 'Totale (€)'];
    var rows = [headers.map(function (h) { return { t: 's', v: h }; })];

    orders.forEach(function (o) {
      var c = o.customer || {};
      var dispositivi = (o.items || []).map(function (it) {
        return (it.model || '') + ' ' + (it.storage || '') + (it.isNew ? ' NUOVO' : '') +
          ' x' + (it.qty || 1) + (it.colors ? ' (' + it.colors + ')' : '');
      }).join('; ');
      var singoli = (o.singles || []).map(function (s) {
        return (s.name || '') + ' x' + (s.qty || 1);
      }).join('; ');
      var bundle = o.bundle ? ('Sì — ' + (o.bundle.items || []).join(' · ')) : '';
      var note = (o.notes || '').replace(/\s*\n\s*/g, ' / ');
      rows.push([
        { t: 's', v: o.date || '' },
        { t: 's', v: c.nome || '' },
        { t: 's', v: c.cognome || '' },
        { t: 's', v: c.cellulare || '' },
        { t: 's', v: c.email || '' },
        { t: 's', v: c.sede || '' },
        { t: 's', v: dispositivi },
        { t: 's', v: singoli },
        { t: 's', v: bundle },
        { t: 's', v: note },
        { t: 'n', v: (o.total != null ? o.total : 0) }
      ]);
    });

    var sheetRows = rows.map(function (cells, r) {
      var cellXml = cells.map(function (cell, ci) {
        var ref = colLetter(ci) + (r + 1);
        if (cell.t === 'n') {
          return '<c r="' + ref + '"><v>' + (Number(cell.v) || 0) + '</v></c>';
        }
        return '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(cell.v) + '</t></is></c>';
      }).join('');
      return '<row r="' + (r + 1) + '">' + cellXml + '</row>';
    }).join('');

    var sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<cols><col min="7" max="10" width="28"/></cols>' +
      '<sheetData>' + sheetRows + '</sheetData></worksheet>';

    var contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '</Types>';

    var rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>';

    var workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets><sheet name="Ordini" sheetId="1" r:id="rId1"/></sheets></workbook>';

    var wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '</Relationships>';

    return zipStore([
      { name: '[Content_Types].xml', bytes: strBytes(contentTypes) },
      { name: '_rels/.rels', bytes: strBytes(rootRels) },
      { name: 'xl/workbook.xml', bytes: strBytes(workbook) },
      { name: 'xl/_rels/workbook.xml.rels', bytes: strBytes(wbRels) },
      { name: 'xl/worksheets/sheet1.xml', bytes: strBytes(sheet) }
    ]);
  }

  function exportExcel() {
    var orders = loadOrders();
    var bytes = buildXlsx(orders);
    var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ordini-' + new Date().toISOString().slice(0, 10) + '.xlsx';
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
      + '<button class="oh-btn" data-act="export">Esporta Excel</button>'
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
        if (confirm('Eliminare tutti gli ordini salvati (anche sul cloud)?')) {
          saveOrders([]);
          renderOrders();
          sbClear(function () { syncNow(); });
        }
        return;
      }
      if (act === 'export') return exportExcel();
      if (act === 'delete') {
        var id = (e.target.closest('[data-id]') || {}).getAttribute && e.target.closest('[data-id]').getAttribute('data-id');
        if (id && confirm('Eliminare questo ordine?')) {
          saveOrders(loadOrders().filter(function (o) { return o.id !== id; }));
          renderOrders();
          if (isUuid(id)) sbDelete(id, function () { syncNow(); });
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
    syncNow();   // migra eventuali ordini locali e carica quelli gia sul cloud
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
