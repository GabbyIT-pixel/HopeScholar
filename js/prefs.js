/* ══════════════════════════════════════════════════════════════
   prefs.js — User Preferences (Bonus: Enhanced Features)
   Saves and restores the user's last selected filters so the
   app remembers their preferences across sessions.
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const PREFS_KEY = 'hopescholar_prefs_v1';

const Prefs = {
  data: {},

  /** Load preferences from localStorage */
  init() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      this.data = raw ? JSON.parse(raw) : {};
    } catch {
      this.data = {};
    }
    this._restore();
  },

  /**
   * Save a preference value.
   * @param {string} key
   * @param {string} value
   */
  set(key, value) {
    this.data[key] = value;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.data));
    } catch { /* ignore */ }
  },

  /**
   * Get a preference value.
   * @param {string} key
   * @param {string} [fallback='']
   * @returns {string}
   */
  get(key, fallback = '') {
    return this.data[key] ?? fallback;
  },

  /** Restore saved filter selections to the UI */
  _restore() {
    const fields = [
      'schol-cat', 'schol-region', 'schol-sort',
      'uni-country', 'uni-sort',
      'country-region', 'country-sort',
    ];
    fields.forEach(id => {
      const el  = document.getElementById(id);
      const val = this.get(id);
      if (el && val) el.value = val;
    });
  },
};

/** Attach preference-saving listeners after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'schol-cat', 'schol-region', 'schol-sort',
    'uni-country', 'uni-sort',
    'country-region', 'country-sort',
  ];
  fields.forEach(id => {
    document.getElementById(id)?.addEventListener('change', e => {
      Prefs.set(id, e.target.value);
    });
  });
});
