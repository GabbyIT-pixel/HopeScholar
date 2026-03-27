/* countries.js — HopeScholar | REST Countries API */
'use strict';

/* Non-sovereign territories to exclude from the list */
const EXCLUDED = [
  'British Indian Ocean Territory',
  'French Southern Territories',
  'Saint Helena, Ascension and Tristan da Cunha',
  'Mayotte',
  'Réunion',
  'Reunion',
  'Western Sahara',
  'Canary Islands',
  'Ceuta',
  'Melilla',
];

const Countries = {
  data: [], loaded: false,

  async load() {
    if (this.loaded) { this.render(); return; }
    clearError('country'); showLoader('country');
    const cached = Cache.get('africa_v2');
    if (cached) { this.data = cached; this.loaded = true; hideLoader('country'); this.render(); showToast('Loaded from cache'); return; }
    try {
      const res = await fetchWithTimeout('https://restcountries.com/v3.1/region/africa?fields=name,flags,capital,population,subregion,cca2');
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Unexpected API response.');

      // Only keep sovereign/recognised African nations
      const filtered = json
        .filter(c => !EXCLUDED.includes(c.name.common) && !EXCLUDED.includes(c.name.official))
        .filter(c => c.population > 0) // removes uninhabited territories
        .sort((a, b) => a.name.common.localeCompare(b.name.common));

      Cache.set('africa_v2', filtered);
      this.data = filtered; this.loaded = true; hideLoader('country'); this.render();
    } catch (e) { hideLoader('country'); showError('country', `Could not load countries: ${e.message}`); }
  },

  render() {
    const grid = $('country-grid');
    const search = validateInput($('country-search').value).toLowerCase();
    const region = $('country-region').value;
    const sort = $('country-sort').value;
    let list = [...this.data];
    if (search) list = list.filter(c => c.name.common.toLowerCase().includes(search) || (c.capital?.[0] ?? '').toLowerCase().includes(search));
    if (region) list = list.filter(c => c.subregion === region);
    if (sort === 'name-asc') list.sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (sort === 'pop-desc') list.sort((a, b) => b.population - a.population);
    if (sort === 'pop-asc') list.sort((a, b) => a.population - b.population);
    showStats('country', `${list.length} countr${list.length !== 1 ? 'ies' : 'y'} shown`);
    if (!list.length) { grid.innerHTML = emptyHtml('C', 'No countries found', 'Adjust your search or region filter.'); return; }
    grid.innerHTML = list.map(c => this._card(c)).join('');
  },

  _card(c) {
    const cap = c.capital?.[0] ?? 'N/A';
    const flagHtml = c.flags?.png
      ? `<img class="country-flag" src="${escapeHtml(c.flags.png)}" alt="Flag of ${escapeHtml(c.name.common)}" loading="lazy"/>`
      : `<span style="font-size:2.2rem">-</span>`;
    const subregionTag = c.subregion
      ? `<span class="tag tag-gold" style="width:fit-content">${escapeHtml(c.subregion)}</span>`
      : '';
    return `<article class="country-card"
    onclick="Countries._onClick('${escapeHtml(c.name.common).replace(/'/g, "\\'")}',this)"
    tabindex="0"
    onkeydown="if(event.key==='Enter')Countries._onClick('${escapeHtml(c.name.common).replace(/'/g, "\\'")}',this)">
    ${flagHtml}
    <p class="country-name">${escapeHtml(c.name.common)}</p>
    <p class="country-capital">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;flex-shrink:0"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      ${escapeHtml(cap)}
    </p>
    <p class="country-pop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;flex-shrink:0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      ${formatNumber(c.population)}
    </p>
    ${subregionTag}
    <div class="country-cta">
      Find universities
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
  </article>`;
  },

  _onClick(name) {
    switchTab('universities');
    window._closeSidebar?.();
    const sel = $('uni-country');
    let opt = Array.from(sel.options).find(o => o.value.toLowerCase() === name.toLowerCase());
    if (!opt) { opt = new Option(name, name); sel.appendChild(opt); }
    sel.value = opt.value;
    Universities.data = []; Universities.loaded = false;
    Universities.load();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  $('country-search')?.addEventListener('input', debounce(() => { if (Countries.loaded) Countries.render(); }, 250));
  $('country-region')?.addEventListener('change', () => { if (Countries.loaded) Countries.render(); });
  $('country-sort')?.addEventListener('change', () => { if (Countries.loaded) Countries.render(); });
});
