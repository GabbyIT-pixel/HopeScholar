/* ══════════════════════════════════════════════════════════════
   app.js — Application entry point
   Initialises all modules and wires tab navigation
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Init saved items from localStorage
  Saved.init();

  // 2. Init user preferences (Bonus: Enhanced Features) — restores last filters
  Prefs.init();

  // 3. Render scholarships immediately (static data — instant)
  Scholarships.render();

  // 4. Wire tab navigation
  document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
      window._closeSidebar?.();

      // Lazy-load on first visit
      if (tab === 'universities' && !Universities.loaded && !$('uni-grid').innerHTML.trim()) {
        Universities.load();
      }
      if (tab === 'countries' && !Countries.loaded) {
        Countries.load();
      }
      if (tab === 'news' && !News.data.length) {
        News.load('scholarship Africa students');
      }
      if (tab === 'saved') {
        Saved.renderTab();
      }
    });
  });

  // 5. Keyboard shortcut: Ctrl+K / Cmd+K → focus scholarship search
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      switchTab('scholarships');
      $('schol-search')?.focus();
    }
  });

});
