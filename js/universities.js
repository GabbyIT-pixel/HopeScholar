/* ══════════════════════════════════════════════════════════════
   universities.js — Fetch, filter, sort and render universities
   API:    Hipolabs Universities API (free, no key required)
   Docs:   https://github.com/Hipo/university-domains-list-api
   Bonus:  API responses cached in localStorage (cache.js)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const Universities = {
  data:   [],
  loaded: false,

  async load() {
    const country = $('uni-country').value;
    this.data   = [];
    this.loaded = false;

    clearError('uni');
    showLoader('uni');

    // ── Check cache first (Bonus: Performance) ──────────────
    const cacheKey = `universities_${country}`;
    const cached   = Cache.get(cacheKey);
    if (cached) {
      this.data   = cached;
      this.loaded = true;
      hideLoader('uni');
      this.render();
      showToast('Loaded from cache ⚡');
      return;
    }

    try {
      // Input validated before building URL (Bonus: Security)
      const safeCountry = validateInput(country, 50);
      const res  = await fetchWithTimeout(
        `https://universities.hipolabs.com/search?country=${encodeURIComponent(safeCountry)}`
      );
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Unexpected response from the API.');

      // Store in cache (Bonus: Performance)
      Cache.set(cacheKey, json);

      this.data   = json;
      this.loaded = true;
      hideLoader('uni');
      this.render();
    } catch (err) {
      hideLoader('uni');
      showError('uni', `Could not load universities: ${err.message}`);
    }
  },

  render() {
    const grid   = $('uni-grid');
    // Input validation (Bonus: Security)
    const search = validateInput($('uni-search').value).toLowerCase();
    const sort   = $('uni-sort').value;

    let list = [...this.data];

    if (search) {
      list = list.filter(u =>
        u.name.toLowerCase().includes(search) ||
        (u.domains || []).join(' ').toLowerCase().includes(search)
      );
    }
    list.sort((a, b) =>
      sort === 'name-asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    showStats('uni', `${list.length} universit${list.length !== 1 ? 'ies' : 'y'} in ${$('uni-country').value}`);

    if (!list.length) {
      grid.innerHTML = emptyStateHtml('🏫', 'No universities found', 'Try a different search term or select another country.');
      return;
    }

    grid.innerHTML = list.map(u => this._cardHtml(u)).join('');
  },

  _cardHtml(u) {
    const url    = u.web_pages?.[0] ?? null;
    const domain = u.domains?.[0]   ?? '—';
    const key    = `uni-${u.name}`;
    const isSaved = Saved.has(key);
    const savedData = JSON.stringify({ name: u.name, country: u.country, url, domain }).replace(/"/g, '&quot;');

    return `
      <article class="uni-card" role="listitem">
        <div class="card-top-row">
          <div class="uni-icon" aria-hidden="true">🎓</div>
          <button class="bm-btn${isSaved ? ' saved' : ''}"
            onclick="Saved.toggle('${escapeHtml(key).replace(/'/g,"\\'")}',${savedData},'university')"
            aria-label="${isSaved ? 'Remove bookmark' : 'Save university'}">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <h3 class="card-name">${escapeHtml(u.name)}</h3>
        <div class="card-tags">
          <span class="tag tag-green">🌍 ${escapeHtml(u.country)}</span>
          <span class="tag tag-gray">🌐 ${escapeHtml(domain)}</span>
        </div>
        ${url
          ? `<a class="card-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Visit Official Website ${ARROW_SVG}</a>`
          : `<span class="card-no-link">No website listed</span>`}
      </article>`;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  $('uni-fetch-btn')?.addEventListener('click', () => Universities.load());
  $('uni-search')?.addEventListener('input', debounce(() => { if (Universities.loaded) Universities.render(); }, 250));
  $('uni-sort')?.addEventListener('change', () => { if (Universities.loaded) Universities.render(); });
  $('uni-country')?.addEventListener('change', () => {
    Universities.data = []; Universities.loaded = false;
    $('uni-grid').innerHTML = '';
    hideEl($('uni-stats')); clearError('uni');
  });
});
