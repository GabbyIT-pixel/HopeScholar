/* scholarships.js — HopeScholar */
'use strict';
const Scholarships = {
  render() {
    const grid = $('schol-grid');
    const search = validateInput($('schol-search').value).toLowerCase();
    const cat = $('schol-cat').value;
    const region = $('schol-region').value;
    const sort = $('schol-sort').value;
    let list = [...SCHOLARSHIPS];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search) || s.country.toLowerCase().includes(search) || s.city.toLowerCase().includes(search) || s.focus.join(' ').toLowerCase().includes(search) || s.tags.join(' ').toLowerCase().includes(search) || s.description.toLowerCase().includes(search));
    if (cat) list = list.filter(s => s.category === cat);
    if (region) list = list.filter(s => s.region === region);
    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'country') list.sort((a, b) => a.country.localeCompare(b.country));
    showStats('schol', `${list.length} scholarship${list.length !== 1 ? 's' : ''} found`);
    const nc = $('schol-nav-count'); if (nc) nc.textContent = list.length || '';
    if (!list.length) { grid.innerHTML = emptyHtml('S', 'No scholarships found', 'Try a different search, category or region.'); return; }
    grid.innerHTML = list.map(s => this._card(s)).join('');
  },

  _card(s) {
    const isSaved = Saved.has(`schol-${s.id}`);
    const catLabel = { mastercard: 'Mastercard Foundation', fullyfunded: 'Fully Funded', global: 'Global Program' }[s.category] || s.category;
    const catClass = { mastercard: 'tag-red', fullyfunded: 'tag-green', global: 'tag-blue' }[s.category] || 'tag-gray';
    const savedData = JSON.stringify({ id: s.id, name: s.name, shortName: s.shortName, logo: s.logo, country: s.country, flag: s.flag, city: s.city, funding: s.funding, focus: s.focus, description: s.description, link: s.link, level: s.level, category: s.category }).replace(/"/g, '&quot;');

    // Logo display
    const logoHtml = s.logo
      ? `<img class="card-logo" src="${escapeHtml(s.logo)}" alt="${escapeHtml(s.shortName)} logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"loading="lazy"/><div class="card-logo-placeholder" style="display:none"><span class="card-logo-text">${escapeHtml(s.shortName.slice(0, 3))}</span></div>`
      : `<div class="card-logo-placeholder"><span class="card-logo-text">${escapeHtml(s.shortName.slice(0, 3))}</span></div>`;

    return `<article class="schol-card" onclick="Scholarships.openModal(${s.id})">
      <div class="card-logo-area">${logoHtml}</div>
      <h3 class="card-title">${escapeHtml(s.name)}</h3>
      <div class="card-meta">
        <div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(s.city)}, ${escapeHtml(s.country)}</div>
        <div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3L2 9l10 6 10-6-10-6z"/><path d="M2 17l10 6 10-6"/></svg>${escapeHtml(s.level)}</div>
      </div>
      <div class="card-tags-row">
        <span class="tag ${catClass}">${escapeHtml(catLabel)}</span>
      </div>
      <div class="card-bottom">
        <span class="tag tag-green">${escapeHtml(s.funding.split('—')[0].trim())}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="bm-btn${isSaved ? ' saved' : ''}" onclick="event.stopPropagation();Saved.toggle('schol-${s.id}',${savedData},'scholarship')" aria-label="Save">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
          <span class="card-link-btn">Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </div>
    </article>`;
  },

  openModal(id) {
    const s = SCHOLARSHIPS.find(x => x.id === id); if (!s) return;
    const isSaved = Saved.has(`schol-${s.id}`);
    const catLabel = { mastercard: 'Mastercard Foundation', fullyfunded: 'Fully Funded', global: 'Global Program' }[s.category] || s.category;
    const catClass = { mastercard: 'tag-red', fullyfunded: 'tag-green', global: 'tag-blue' }[s.category] || 'tag-gray';
    const savedData = JSON.stringify({ id: s.id, name: s.name, shortName: s.shortName, logo: s.logo, country: s.country, flag: s.flag, city: s.city, funding: s.funding, focus: s.focus, description: s.description, link: s.link, level: s.level, category: s.category }).replace(/"/g, '&quot;');
    const logoHtml = s.logo ? `<img src="${escapeHtml(s.logo)}" alt="${escapeHtml(s.name)}" style="max-width:52px;max-height:52px;object-fit:contain" onerror="this.style.display='none'">` : `<span class="modal-logo-text">${escapeHtml(s.shortName.slice(0, 3))}</span>`;
    const focusPills = s.focus.map(f => `<span class="focus-pill">${escapeHtml(f)}</span>`).join('');
    const tagsPills = s.tags.map(t => `<span class="tag tag-gray">${escapeHtml(t)}</span>`).join('');

    $('modal-body').innerHTML = `
      <div class="modal-header">
        <div class="modal-logo-wrap">${logoHtml}</div>
        <div class="modal-header-text">
          <h2 class="modal-title">${escapeHtml(s.name)}</h2>
          <div class="modal-subtitle-tags">
            <span class="tag ${catClass}">${escapeHtml(catLabel)}</span>
            <span class="tag tag-gray">${s.flag} ${escapeHtml(s.country)}</span>
            <span class="tag tag-gold">${escapeHtml(s.level)}</span>
          </div>
        </div>
      </div>
      <div class="modal-content">
        <div class="modal-section">
          <p class="modal-label">Location</p>
          <p class="modal-value">${escapeHtml(s.city)}, ${escapeHtml(s.country)}</p>
        </div>
        <div class="modal-section">
          <p class="modal-label">Funding</p>
          <p class="modal-value bold-green">${escapeHtml(s.funding)}</p>
        </div>
        <div class="modal-section">
          <p class="modal-label">Course Focus Areas</p>
          <div class="focus-pills">${focusPills}</div>
        </div>
        <hr class="modal-divider"/>
        <div class="modal-section">
          <p class="modal-label">About</p>
          <p class="modal-value">${escapeHtml(s.description)}</p>
        </div>
        <div class="modal-section">
          <p class="modal-label">Tags</p>
          <div style="display:flex;flex-wrap:wrap;gap:5px">${tagsPills}</div>
        </div>
        <div class="modal-actions">
          <a class="modal-apply-btn" href="${escapeHtml(s.link)}" target="_blank" rel="noopener noreferrer">
            Visit Official Website — Apply Now
          </a>
          <button class="modal-save-btn${isSaved ? ' saved' : ''}" id="modal-save-btn"
            onclick="Saved.toggle('schol-${s.id}',${savedData},'scholarship');this.classList.toggle('saved');this.innerHTML=this.classList.contains('saved')?'Saved — Click to Remove':'Save This Scholarship'">
            ${isSaved ? 'Saved — Click to Remove' : 'Save This Scholarship'}
          </button>
        </div>
      </div>`;
    openModal();
  },
};
document.addEventListener('DOMContentLoaded', () => {
  $('schol-search')?.addEventListener('input', debounce(() => Scholarships.render(), 220));
  $('schol-cat')?.addEventListener('change', () => Scholarships.render());
  $('schol-region')?.addEventListener('change', () => Scholarships.render());
  $('schol-sort')?.addEventListener('change', () => Scholarships.render());
});
