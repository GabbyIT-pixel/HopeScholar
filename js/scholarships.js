/* ══════════════════════════════════════════════════════════════
   scholarships.js — Clean cards + detail modal
   Project: HopeScholar | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */
'use strict';

const Scholarships = {

  render() {
    const grid   = $('schol-grid');
    const search = validateInput($('schol-search').value).toLowerCase();
    const cat    = $('schol-cat').value;
    const region = $('schol-region').value;
    const sort   = $('schol-sort').value;
    let list     = [...SCHOLARSHIPS];

    if (search) list = list.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.country.toLowerCase().includes(search) ||
      s.focus.toLowerCase().includes(search) ||
      s.description.toLowerCase().includes(search) ||
      s.tags.join(' ').toLowerCase().includes(search)
    );
    if (cat)    list = list.filter(s => s.category === cat);
    if (region) list = list.filter(s => s.region   === region);
    if (sort === 'name-asc')  list.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort === 'name-desc') list.sort((a,b)=>b.name.localeCompare(a.name));
    if (sort === 'country')   list.sort((a,b)=>a.country.localeCompare(b.country));

    showStats('schol', `${list.length} scholarship${list.length!==1?'s':''} found`);
    const tot=$('schol-total'); if(tot) tot.textContent=`${SCHOLARSHIPS.length} total`;

    if (!list.length) { grid.innerHTML=emptyStateHtml('🎓','No scholarships found','Try different search, category or region.'); return; }
    grid.innerHTML = list.map(s => this._cardHtml(s)).join('');
  },

  _cardHtml(s) {
    const isSaved  = Saved.has(`schol-${s.id}`);
    const catClass = {mastercard:'tag-red',fullyfunded:'tag-green',global:'tag-blue'}[s.category]||'tag-gray';
    const catLabel = {mastercard:'Mastercard',fullyfunded:'Fully Funded',global:'Global'}[s.category]||s.category;
    const savedData = JSON.stringify({id:s.id,name:s.name,country:s.country,flag:s.flag,funding:s.funding,focus:s.focus,description:s.description,link:s.link}).replace(/"/g,'&quot;');
    return `
      <article class="schol-card" role="listitem" onclick="Scholarships.openModal(${s.id})">
        <div class="card-top-row">
          <div class="card-left">
            <span class="card-flag">${s.flag}</span>
            <div>
              <span class="tag ${catClass}">${escapeHtml(catLabel)}</span>
              <p class="card-country">${escapeHtml(s.country)}</p>
            </div>
          </div>
          <button class="bm-btn${isSaved?' saved':''}"
            onclick="event.stopPropagation();Saved.toggle('schol-${s.id}',${savedData},'scholarship')"
            aria-label="${isSaved?'Remove':'Save'}">
            <svg viewBox="0 0 24 24" fill="${isSaved?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
        <h3 class="card-name">${escapeHtml(s.name)}</h3>
        <p class="card-funding">${escapeHtml(s.funding)}</p>
        <div class="card-footer">
          <span class="tag tag-gray">📚 ${escapeHtml(s.level)}</span>
          <span class="card-more">View details ${ARROW_SVG}</span>
        </div>
      </article>`;
  },

  openModal(id) {
    const s = SCHOLARSHIPS.find(x=>x.id===id); if(!s) return;
    const catLabel = {mastercard:'Mastercard Foundation',fullyfunded:'Fully Funded',global:'Global Scholarship'}[s.category]||s.category;
    const catClass = {mastercard:'tag-red',fullyfunded:'tag-green',global:'tag-blue'}[s.category]||'tag-gray';
    const isSaved  = Saved.has(`schol-${s.id}`);
    const savedData = JSON.stringify({id:s.id,name:s.name,country:s.country,flag:s.flag,funding:s.funding,focus:s.focus,description:s.description,link:s.link}).replace(/"/g,'&quot;');
    const tagsHtml = s.tags.map(t=>`<span class="tag tag-gray">${escapeHtml(t)}</span>`).join('');

    $('modal-body').innerHTML = `
      <div class="modal-flag">${s.flag}</div>
      <h2 class="modal-title">${escapeHtml(s.name)}</h2>
      <div class="modal-tags">
        <span class="tag ${catClass}">${escapeHtml(catLabel)}</span>
        <span class="tag tag-gray">📍 ${escapeHtml(s.country)}</span>
        <span class="tag tag-gold">📚 ${escapeHtml(s.level)}</span>
      </div>
      <hr class="modal-divider"/>
      <div class="modal-section">
        <p class="modal-label">Funding</p>
        <p class="modal-value green">${escapeHtml(s.funding)}</p>
      </div>
      <div class="modal-section">
        <p class="modal-label">Course Focus Areas</p>
        <p class="modal-value">${escapeHtml(s.focus)}</p>
      </div>
      <div class="modal-section">
        <p class="modal-label">About</p>
        <p class="modal-value">${escapeHtml(s.description)}</p>
      </div>
      <div class="modal-section">
        <p class="modal-label">Tags</p>
        <div class="modal-tags">${tagsHtml}</div>
      </div>
      <div class="modal-actions">
        <a class="modal-btn-primary" href="${escapeHtml(s.link)}" target="_blank" rel="noopener noreferrer">
          Check Applications on Official Website ${ARROW_SVG}
        </a>
        <button class="modal-btn-save${isSaved?' saved':''}" id="modal-save-btn"
          onclick="Saved.toggle('schol-${s.id}',${savedData},'scholarship');this.classList.toggle('saved');this.textContent=this.classList.contains('saved')?'🔖 Saved':'🔖 Save';">
          ${isSaved?'🔖 Saved':'🔖 Save'}
        </button>
      </div>`;

    const o=$('modal-overlay');
    o.classList.remove('hidden'); o.style.display='flex';
    document.body.style.overflow='hidden';
  },
};

document.addEventListener('DOMContentLoaded',()=>{
  $('schol-search')?.addEventListener('input', debounce(()=>Scholarships.render(),200));
  $('schol-cat')?.addEventListener('change',    ()=>Scholarships.render());
  $('schol-region')?.addEventListener('change', ()=>Scholarships.render());
  $('schol-sort')?.addEventListener('change',   ()=>Scholarships.render());
  $('modal-overlay')?.addEventListener('click', e=>{ if(e.target===$('modal-overlay')) closeModal(); });
  $('modal-close')?.addEventListener('click', closeModal);
});
