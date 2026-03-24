/* ui.js — DOM helpers | HopeScholar */
'use strict';
const $=(id)=>document.getElementById(id);
function showEl(el){if(el)el.style.display='';}
function hideEl(el){if(el)el.style.display='none';}
function showLoader(p){hideEl($(`${p}-error`));hideEl($(`${p}-stats`));const g=$(`${p}-grid`);if(g)g.innerHTML='';showEl($(`${p}-loader`));}
function hideLoader(p){hideEl($(`${p}-loader`));}
function showError(p,msg){const el=$(`${p}-error`);if(!el)return;el.textContent=msg;showEl(el);}
function clearError(p){hideEl($(`${p}-error`));}
function showStats(p,t){const el=$(`${p}-stats`);if(!el)return;el.textContent=t;showEl(el);}
function emptyStateHtml(icon,title,desc){return`<div class="empty-inline"><div class="empty-icon">${icon}</div><h2 class="empty-title">${escapeHtml(title)}</h2><p class="empty-desc">${escapeHtml(desc)}</p></div>`;}
function showToast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function switchTab(name){document.querySelectorAll('.nav-btn').forEach(b=>{const a=b.dataset.tab===name;b.classList.toggle('active',a);b.setAttribute('aria-current',a?'page':'false');});document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===`tab-${name}`));}
function closeModal(){const o=$('modal-overlay');if(o){o.classList.add('hidden');o.style.display='none';document.body.style.overflow='';}}
(function initSidebar(){const s=document.getElementById('sidebar'),b=document.getElementById('backdrop'),h=document.getElementById('hamburger');function open(){s.classList.add('open');b.classList.add('open');h.setAttribute('aria-expanded','true');}function close(){s.classList.remove('open');b.classList.remove('open');h.setAttribute('aria-expanded','false');}h?.addEventListener('click',()=>s.classList.contains('open')?close():open());b?.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeModal();}});window._closeSidebar=close;})();
