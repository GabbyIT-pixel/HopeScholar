/* ══════════════════════════════════════════════════════════════
   saved.js — Bookmark scholarships and universities
   Storage: localStorage (client-side, no server needed)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const STORAGE_KEY = 'hopescholar_saved_v1';

const Saved = {
  items: {},

  init() {
    try {
      const raw  = localStorage.getItem(STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : {};
    } catch { this.items = {}; }
    this._updateBadge();
  },

  has(id) { return !!this.items[id]; },

  toggle(id, data, type) {
    if (this.items[id]) {
      delete this.items[id];
      this._updateBtn(id, false);
      showToast('Removed from saved');
    } else {
      this.items[id] = { data, type };
      this._updateBtn(id, true);
      showToast('Saved! View in Saved tab 🔖');
    }
    this._persist();
    this._updateBadge();
    if (document.getElementById('tab-saved')?.classList.contains('active')) {
      this.renderTab();
    }
  },

  remove(id, card) {
    delete this.items[id];
    this._persist();
    this._updateBadge();
    if (card) {
      card.style.transition = 'opacity 0.2s, transform 0.2s';
      card.style.opacity    = '0';
      card.style.transform  = 'scale(0.96)';
      setTimeout(() => this.renderTab(), 220);
    } else {
      this.renderTab();
    }
  },

  renderTab() {
    const grid  = $('saved-grid');
    const empty = $('saved-empty');
    const keys  = Object.keys(this.items);
    if (!keys.length) { grid.innerHTML = ''; showEl(empty); return; }
    hideEl(empty);
    grid.innerHTML = keys.map(id => {
      const { data, type } = this.items[id];
      return type === 'scholarship' ? this._scholCard(id, data) : this._uniCard(id, data);
    }).join('');
  },

  _scholCard(id, s) {
    return `
      <article class="schol-card" role="listitem">
        <div class="card-top-row">
          <span class="card-flag" aria-hidden="true">${s.flag || '🎓'}</span>
          <button class="bm-btn saved" onclick="Saved.remove('${escapeHtml(id)}',this.closest('.schol-card'))" title="Remove">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <h3 class="card-name">${escapeHtml(s.name)}</h3>
        <div class="card-tags">
          <span class="tag tag-gold">🔖 Saved</span>
          <span class="tag tag-gray">📍 ${escapeHtml(s.country || '')}</span>
        </div>
        <p class="card-funding">${escapeHtml(s.funding || '')}</p>
        <p class="card-focus">📖 ${escapeHtml(s.focus || '')}</p>
        <p class="card-desc">${escapeHtml(s.description || '')}</p>
        ${s.link ? `<a class="card-link" href="${escapeHtml(s.link)}" target="_blank" rel="noopener noreferrer">Check Applications on Official Website ${ARROW_SVG}</a>` : ''}
      </article>`;
  },

  _uniCard(id, u) {
    return `
      <article class="uni-card" role="listitem">
        <div class="card-top-row">
          <div class="uni-icon" aria-hidden="true">🎓</div>
          <button class="bm-btn saved" onclick="Saved.remove('${escapeHtml(id)}',this.closest('.uni-card'))" title="Remove">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <h3 class="card-name">${escapeHtml(u.name)}</h3>
        <div class="card-tags">
          <span class="tag tag-green">🌍 ${escapeHtml(u.country || '')}</span>
          <span class="tag tag-gold">🔖 Saved</span>
        </div>
        ${u.url ? `<a class="card-link" href="${escapeHtml(u.url)}" target="_blank" rel="noopener noreferrer">Visit Official Website ${ARROW_SVG}</a>` : `<span class="card-no-link">No website listed</span>`}
      </article>`;
  },

  _persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)); } catch {}
  },

  _updateBadge() {
    const badge = $('saved-badge');
    if (!badge) return;
    const count = Object.keys(this.items).length;
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  },

  _updateBtn(id, saved) {
    document.querySelectorAll('.bm-btn').forEach(btn => {
      if ((btn.getAttribute('onclick') || '').includes(id)) {
        btn.classList.toggle('saved', saved);
        btn.querySelector('svg')?.setAttribute('fill', saved ? 'currentColor' : 'none');
      }
    });
  },
};
