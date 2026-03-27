/* app.js — HopeScholar entry point */
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  Saved.init();
  Prefs.init();
  Finder.init();
  Scholarships.render();

  document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
      window._closeSidebar?.();
      if (tab === 'universities' && !Universities.loaded && !$('uni-grid').innerHTML.trim()) Universities.load();
      if (tab === 'countries' && !Countries.loaded) Countries.load();
      if (tab === 'news' && !News.data.length) News.load('scholarship Africa');
      if (tab === 'saved') Saved.renderTab();
      if (tab === 'finder') { Finder.showForm(); }
    });
  });

  // Ctrl+K = focus scholarship search
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      switchTab('scholarships');
      $('schol-search')?.focus();
    }
  });
});
