/**
 * App Entry Point - Initializes HopeScholar when the page loads
 *
 * This is where everything starts. When the page finishes loading,
 * we set up all the modules and event listeners that make the app work.
 *
 * What happens on startup:
 * 1. Initialize saved items (bookmarks)
 * 2. Initialize user preferences
 * 3. Initialize the scholarship finder form
 * 4. Render the scholarships tab (default view)
 * 5. Set up navigation click handlers
 * 6. Set up keyboard shortcuts (Ctrl+K for search)
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all the modules that need to set up first
  Saved.init(); // Load saved scholarships from localStorage
  Prefs.init(); // Load user preferences
  Finder.init(); // Set up the scholarship finder form
  Scholarships.render(); // Show the scholarships tab by default

  // Handle navigation tab clicks
  document.querySelectorAll(".nav-btn[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
      window._closeSidebar?.();

      // Lazy load data only when user clicks on these tabs
      // This makes the app faster on startup
      if (
        tab === "universities" &&
        !Universities.loaded &&
        !$("uni-grid").innerHTML.trim()
      ) {
        Universities.load(); // Fetch universities from API
      }
      if (tab === "countries" && !Countries.loaded) {
        Countries.load(); // Fetch countries from API
      }
      if (tab === "news" && !News.data.length) {
        News.load("scholarship Africa"); // Fetch news from RSS
      }
      if (tab === "saved") {
        Saved.renderTab(); // Show saved bookmarks
      }
      if (tab === "finder") {
        Finder.showForm(); // Show the finder form
      }
    });
  });

  // Keyboard shortcut: Ctrl+K quickly jumps to scholarship search
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault(); // Prevent browser's default search
      switchTab("scholarships");
      $("schol-search")?.focus(); // Put cursor in search box
    }
  });
});
