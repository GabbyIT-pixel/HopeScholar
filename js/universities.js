/* universities.js — HopeScholar | Hipolabs API with proxy fallback */
'use strict';
const Universities={data:[],loaded:false,_filtered:[],

async _fetchData(country){
  const enc=encodeURIComponent(validateInput(country,50));
  const urls=[
    `https://universities.hipolabs.com/search?country=${enc}`,
    `http://universities.hipolabs.com/search?country=${enc}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent('http://universities.hipolabs.com/search?country='+enc)}`,
  ];
  for(const url of urls){
    try{
      const res=await fetchWithTimeout(url,9000);
      const json=await res.json();
      if(Array.isArray(json)&&json.length>=0)return json;
    }catch{continue;}
  }
  throw new Error('Cannot connect to the universities API. Please check your internet connection and try again.');
},

async load(){
  const country=$('uni-country').value;
  this.data=[];this.loaded=false;
  clearError('uni');showLoader('uni');
  const ck=`uni_${country}`;
  const cached=Cache.get(ck);
  if(cached){this.data=cached;this.loaded=true;hideLoader('uni');this.render();showToast('Loaded from cache ⚡');return;}
  try{
    const json=await this._fetchData(country);
    Cache.set(ck,json);
    this.data=json;this.loaded=true;hideLoader('uni');this.render();
  }catch(e){hideLoader('uni');showError('uni',e.message);}
},

render(){
  const grid=$('uni-grid');
  const search=validateInput($('uni-search').value).toLowerCase();
  const sort=$('uni-sort').value;
  let list=[...this.data];
  if(search)list=list.filter(u=>u.name.toLowerCase().includes(search)||(u.domains||[]).join(' ').toLowerCase().includes(search));
  list.sort((a,b)=>sort==='name-asc'?a.name.localeCompare(b.name):b.name.localeCompare(a.name));
  this._filtered=list;
  showStats('uni',`${list.length} universit${list.length!==1?'ies':'y'} in ${$('uni-country').value}`);
  if(!list.length){grid.innerHTML=emptyHtml('🏫','No universities found','Try a different search or select another country.');return;}
  grid.innerHTML=list.map((u,i)=>this._card(u,i)).join('');
},

_initial(name){
  return (name.split(' ').filter(w=>w.length>2).slice(0,3).map(w=>w[0]||'').join('').toUpperCase().slice(0,3))||name.slice(0,3).toUpperCase();
},

_card(u,i){
  const url=u.web_pages?.[0]??null;
  const domain=u.domains?.[0]??'—';
  const key=`uni-${u.name}`;
  const isSaved=Saved.has(key);
  const sd=JSON.stringify({name:u.name,country:u.country,url,domain}).replace(/"/g,'&quot;');
  const init=this._initial(u.name);
  return`<article class="uni-card" onclick="Universities.openModal(${i})">
    <div class="card-logo-area">
      <div class="card-logo-placeholder"><span class="card-logo-text">${escapeHtml(init)}</span></div>
    </div>
    <h3 class="card-title">${escapeHtml(u.name)}</h3>
    <div class="card-meta">
      <div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(u.country)}</div>
      <div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>${escapeHtml(domain)}</div>
    </div>
    <div class="card-bottom">
      <span class="tag tag-green">🌍 ${escapeHtml(u.country)}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="bm-btn${isSaved?' saved':''}" onclick="event.stopPropagation();Saved.toggle('${escapeHtml(key).replace(/'/g,"\\'")}',${sd},'university')" aria-label="Save">
          <svg viewBox="0 0 24 24" fill="${isSaved?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
        <span class="card-link-btn">Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </div>
    </div>
  </article>`;
},

openModal(i){
  const u=this._filtered[i];if(!u)return;
  const url=u.web_pages?.[0]??null;
  const allDomains=(u.domains||[]).join(', ')||'—';
  const init=this._initial(u.name);
  $('modal-body').innerHTML=`
    <div class="modal-header">
      <div class="modal-logo-wrap"><span class="modal-logo-text">${escapeHtml(init)}</span></div>
      <div class="modal-header-text">
        <h2 class="modal-title">${escapeHtml(u.name)}</h2>
        <div class="modal-subtitle-tags"><span class="tag tag-green">🌍 ${escapeHtml(u.country)}</span></div>
      </div>
    </div>
    <div class="modal-content">
      <div class="modal-section"><p class="modal-label">Country</p><p class="modal-value">${escapeHtml(u.country)}</p></div>
      <div class="modal-section"><p class="modal-label">Web Domain(s)</p><p class="modal-value">${escapeHtml(allDomains)}</p></div>
      ${url?`<div class="modal-section"><p class="modal-label">Official Website</p><p class="modal-value"><a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="color:var(--primary-dk);font-weight:600;text-decoration:underline">${escapeHtml(url)}</a></p></div>`:''}
      <div class="modal-actions">
        ${url?`<a class="modal-apply-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Visit Official University Website</a>`:`<span style="padding:14px;background:var(--gray-100);color:var(--gray-400);border-radius:8px;text-align:center;display:block">No website available</span>`}
      </div>
    </div>`;
  openModal();
}};

document.addEventListener('DOMContentLoaded',()=>{
  $('uni-fetch-btn')?.addEventListener('click',()=>Universities.load());
  $('uni-search')?.addEventListener('input',debounce(()=>{if(Universities.loaded)Universities.render();},250));
  $('uni-sort')?.addEventListener('change',()=>{if(Universities.loaded)Universities.render();});
  $('uni-country')?.addEventListener('change',()=>{Universities.data=[];Universities.loaded=false;$('uni-grid').innerHTML='';hideEl($('uni-stats'));clearError('uni');});
});
