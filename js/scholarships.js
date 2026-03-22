/* ══════════════════════════════════════════════════════════════
   scholarships.js — Filter, sort and render scholarship data
   Data source: js/data.js (50 curated scholarships)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const Scholarships = {

  render() {
    const grid   = $('schol-grid');
    // Input validation (Bonus: Security) — sanitise before use
    const search = validateInput($('schol-search').value).toLowerCase();
    const cat    = $('schol-cat').value;
    const region = $('schol-region').value;
    const sort   = $('schol-sort').value;

    let list = [...SCHOLARSHIPS];

    // ── Filter ──────────────────────────────────────────────
    if (search) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(search)        ||
        s.country.toLowerCase().includes(search)     ||
        s.focus.toLowerCase().includes(search)       ||
        s.description.toLowerCase().includes(search) ||
        s.tags.join(' ').toLowerCase().includes(search)
      );
    }
    if (cat)    list = list.filter(s => s.category === cat);
    if (region) list = list.filter(s => s.region   === region);

    // ── Sort ────────────────────────────────────────────────
    if (sort === 'name-asc')  list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'country')   list.sort((a, b) => a.country.localeCompare(b.country));

    // ── Stats ────────────────────────────────────────────────
    showStats('schol', `${list.length} scholarship${list.length !== 1 ? 's' : ''} found`);
    const total = $('schol-total');
    if (total) total.textContent = `${SCHOLARSHIPS.length} total`;

    // ── Empty ────────────────────────────────────────────────
    if (!list.length) {
      grid.innerHTML = emptyStateHtml('🎓', 'No scholarships found', 'Try a different search term, category or region.');
      return;
    }

    grid.innerHTML = list.map(s => this._cardHtml(s)).join('');
  },

  _cardHtml(s) {
    const isSaved  = Saved.has(`schol-${s.id}`);
    const catLabel = { mastercard: 'Mastercard Foundation', fullyfunded: 'Fully Funded', global: 'Global Scholarship' }[s.category] || s.category;
    const catClass = { mastercard: 'tag-red', fullyfunded: 'tag-green', global: 'tag-blue' }[s.category] || 'tag-gray';
    const tagsHtml = s.tags.slice(0, 3).map(t => `<span class="tag tag-gray">${escapeHtml(t)}</span>`).join('');
    const savedData = JSON.stringify({ id: s.id, name: s.name, country: s.country, flag: s.flag, funding: s.funding, focus: s.focus, description: s.description, link: s.link }).replace(/"/g, '&quot;');

    return `
      <article class="schol-card" role="listitem">
        <div class="card-top-row">
          <span class="card-flag" aria-hidden="true">${s.flag}</span>
          <button class="bm-btn${isSaved ? ' saved' : ''}"
            onclick="Saved.toggle('schol-${s.id}',${savedData},'scholarship')"
            aria-label="${isSaved ? 'Remove bookmark' : 'Save scholarship'}"
            title="${isSaved ? 'Remove from saved' : 'Save to bookmarks'}">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <h3 class="card-name">${escapeHtml(s.name)}</h3>
        <div class="card-tags">
          <span class="tag ${catClass}">${escapeHtml(catLabel)}</span>
          <span class="tag tag-gray">📍 ${escapeHtml(s.country)}</span>
          <span class="tag tag-gold">📚 ${escapeHtml(s.level)}</span>
        </div>
        <p class="card-funding">${escapeHtml(s.funding)}</p>
        <p class="card-focus">📖 ${escapeHtml(s.focus)}</p>
        <p class="card-desc">${escapeHtml(s.description)}</p>
        <div class="card-tags" style="margin-top:4px">${tagsHtml}</div>
        <a class="card-link" href="${escapeHtml(s.link)}" target="_blank" rel="noopener noreferrer">
          Check Applications on Official Website ${ARROW_SVG}
        </a>
      </article>`;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  $('schol-search')?.addEventListener('input',  debounce(() => Scholarships.render(), 200));
  $('schol-cat')?.addEventListener('change',    () => Scholarships.render());
  $('schol-region')?.addEventListener('change', () => Scholarships.render());
  $('schol-sort')?.addEventListener('change',   () => Scholarships.render());
});
