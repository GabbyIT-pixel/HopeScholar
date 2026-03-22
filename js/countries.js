/* ══════════════════════════════════════════════════════════════
   countries.js — Fetch, filter, sort and render African countries
   API:    REST Countries v3 (free, no key required)
   Docs:   https://restcountries.com/#api-endpoints-v3
   Bonus:  API responses cached in localStorage (cache.js)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const Countries = {
  data:   [],
  loaded: false,

  async load() {
    if (this.loaded) { this.render(); return; }

    clearError('country');
    showLoader('country');

    // ── Check cache first (Bonus: Performance) ──────────────
    const cached = Cache.get('african_countries');
    if (cached) {
      this.data   = cached;
      this.loaded = true;
      hideLoader('country');
      this.render();
      showToast('Loaded from cache ⚡');
      return;
    }

    try {
      const res  = await fetchWithTimeout(
        'https://restcountries.com/v3.1/region/africa?fields=name,flags,capital,population,subregion,cca2'
      );
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Unexpected response from the API.');

      const sorted = json.sort((a, b) => a.name.common.localeCompare(b.name.common));

      // Store in cache (Bonus: Performance)
      Cache.set('african_countries', sorted);

      this.data   = sorted;
      this.loaded = true;
      hideLoader('country');
      this.render();
    } catch (err) {
      hideLoader('country');
      showError('country', `Could not load countries: ${err.message}`);
    }
  },

  render() {
    const grid   = $('country-grid');
    // Input validation (Bonus: Security)
    const search = validateInput($('country-search').value).toLowerCase();
    const region = $('country-region').value;
    const sort   = $('country-sort').value;

    let list = [...this.data];

    if (search) {
      list = list.filter(c =>
        c.name.common.toLowerCase().includes(search) ||
        (c.capital?.[0] ?? '').toLowerCase().includes(search)
      );
    }
    if (region) list = list.filter(c => c.subregion === region);

    if (sort === 'name-asc')  list.sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (sort === 'pop-desc')  list.sort((a, b) => b.population - a.population);
    if (sort === 'pop-asc')   list.sort((a, b) => a.population - b.population);

    showStats('country', `${list.length} countr${list.length !== 1 ? 'ies' : 'y'} shown`);

    if (!list.length) {
      grid.innerHTML = emptyStateHtml('🌍', 'No countries found', 'Try adjusting your search or region filter.');
      return;
    }

    grid.innerHTML = list.map(c => this._cardHtml(c)).join('');
  },

  _cardHtml(c) {
    const capital  = c.capital?.[0] ?? 'N/A';
    const flagHtml = c.flags?.png
      ? `<img class="country-flag" src="${escapeHtml(c.flags.png)}" alt="Flag of ${escapeHtml(c.name.common)}" loading="lazy" width="58" height="38"/>`
      : `<span style="font-size:2rem" aria-hidden="true">🏳️</span>`;

    return `
      <article class="country-card" role="listitem"
        onclick="Countries._onClick('${escapeHtml(c.name.common).replace(/'/g,"\\'")}')"
        tabindex="0"
        aria-label="${escapeHtml(c.name.common)} — click to find universities"
        onkeydown="if(event.key==='Enter')Countries._onClick('${escapeHtml(c.name.common).replace(/'/g,"\\'")}')">
        ${flagHtml}
        <h3 class="country-name">${escapeHtml(c.name.common)}</h3>
        <p class="country-capital">🏛 ${escapeHtml(capital)}</p>
        <p class="country-pop">👥 ${formatNumber(c.population)}</p>
        ${c.subregion ? `<span class="tag tag-gold" style="width:fit-content;margin-top:2px">${escapeHtml(c.subregion)}</span>` : ''}
        <p class="country-cta">🎓 Find universities ${ARROW_SVG}</p>
      </article>`;
  },

  _onClick(name) {
    switchTab('universities');
    window._closeSidebar?.();
    const select = $('uni-country');
    let opt = Array.from(select.options).find(o => o.value.toLowerCase() === name.toLowerCase());
    if (!opt) { opt = new Option(name, name); select.appendChild(opt); }
    select.value = opt.value;
    Prefs.set('uni-country', opt.value);
    Universities.data = []; Universities.loaded = false;
    Universities.load();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  $('country-search')?.addEventListener('input',  debounce(() => { if (Countries.loaded) Countries.render(); }, 250));
  $('country-region')?.addEventListener('change', () => { if (Countries.loaded) Countries.render(); });
  $('country-sort')?.addEventListener('change',   () => { if (Countries.loaded) Countries.render(); });
});
