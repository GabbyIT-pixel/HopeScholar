/* ui.js — DOM helpers, tab routing, sidebar, toast, modal */
'use strict';
const $=id=>document.getElementById(id);
const showEl=el=>{if(el)el.style.display='';};
const hideEl=el=>{if(el)el.style.display='none';};
function showLoader(p){hideEl($(`${p}-error`));hideEl($(`${p}-stats`));const g=$(`${p}-grid`);if(g)g.innerHTML='';showEl($(`${p}-loader`));}
function hideLoader(p){hideEl($(`${p}-loader`));}
function showError(p,m){const e=$(`${p}-error`);if(!e)return;e.textContent=m;showEl(e);}
function clearError(p){hideEl($(`${p}-error`));}
function showStats(p,t){const e=$(`${p}-stats`);if(!e)return;e.textContent=t;showEl(e);}
function showToast(m){const t=$('toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function switchTab(name){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===`tab-${name}`));
}
function openModal(){const o=$('modal-overlay');if(!o)return;o.style.display='flex';document.body.style.overflow='hidden';}
function closeModal(){const o=$('modal-overlay');if(!o)return;o.style.display='none';document.body.style.overflow='';}
function emptyHtml(icon,title,desc){return`<div class="empty-inline"><div class="empty-icon">${icon}</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(desc)}</p></div>`;}
// Sidebar
(function(){const s=$('sidebar'),b=$('backdrop'),h=$('hamburger');if(!h)return;const open=()=>{s.classList.add('open');b.classList.add('open');h.setAttribute('aria-expanded','true');};const close=()=>{s.classList.remove('open');b.classList.remove('open');h.setAttribute('aria-expanded','false');};h.addEventListener('click',()=>s.classList.contains('open')?close():open());b.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeModal();}});window._closeSidebar=close;})();
// Modal close
document.addEventListener('DOMContentLoaded',()=>{$('modal-close')?.addEventListener('click',closeModal);$('modal-overlay')?.addEventListener('click',e=>{if(e.target===$('modal-overlay'))closeModal();});});
