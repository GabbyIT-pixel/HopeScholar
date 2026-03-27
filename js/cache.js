/* cache.js — API response caching (Bonus: Performance) */
'use strict';
const Cache = { TTL: 60 * 60 * 1000, get(k) { try { const r = localStorage.getItem('hs_c_' + k); if (!r) return null; const { d, t } = JSON.parse(r); if (Date.now() - t > this.TTL) { localStorage.removeItem('hs_c_' + k); return null; } return d; } catch { return null; } }, set(k, d) { try { localStorage.setItem('hs_c_' + k, JSON.stringify({ d, t: Date.now() })); } catch { } }, clear() { try { Object.keys(localStorage).filter(k => k.startsWith('hs_c_')).forEach(k => localStorage.removeItem(k)); } catch { } } };
