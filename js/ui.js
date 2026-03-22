/* ══════════════════════════════════════════════════════════════
   ui.js — DOM helpers, loaders, errors, stats, tab routing
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const $ = (id) => document.getElementById(id);

function showEl(el) { if (el) el.style.display = ''; }
function hideEl(el) { if (el) el.style.display = 'none'; }

function showLoader(prefix) {
  hideEl($(`${prefix}-error`));
  hideEl($(`${prefix}-stats`));
  const grid = $(`${prefix}-grid`);
  if (grid) grid.innerHTML = '';
  showEl($(`${prefix}-loader`));
}

function hideLoader(prefix) {
  hideEl($(`${prefix}-loader`));
}

function showError(prefix, message) {
  const el = $(`${prefix}-error`);
  if (!el) return;
  el.textContent = message;
  showEl(el);
}

function clearError(prefix) {
  hideEl($(`${prefix}-error`));
}

function showStats(prefix, text) {
  const el = $(`${prefix}-stats`);
  if (!el) return;
  el.textContent = text;
  showEl(el);
}

function emptyStateHtml(icon, title, desc) {
  return `<div class="empty-inline">
    <div class="empty-icon" aria-hidden="true">${icon}</div>
    <h2 class="empty-title">${escapeHtml(title)}</h2>
    <p class="empty-desc">${escapeHtml(desc)}</p>
  </div>`;
}

/** Show a brief toast notification */
function showToast(message) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/** Switch active tab panel */
function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
}

// ── Mobile sidebar ───────────────────────────────────────────
(function initSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const backdrop  = document.getElementById('backdrop');
  const hamburger = document.getElementById('hamburger');

  function open() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () =>
    sidebar.classList.contains('open') ? close() : open()
  );
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window._closeSidebar = close;
})();
