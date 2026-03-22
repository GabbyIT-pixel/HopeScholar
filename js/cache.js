/* ══════════════════════════════════════════════════════════════
   cache.js — API Response Caching (Bonus: Performance)
   Caches API responses in localStorage with a 1-hour TTL.
   Repeat visits load instantly without hitting the API again.
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const Cache = {
  TTL_MS: 60 * 60 * 1000, // 1 hour in milliseconds

  /**
   * Get a cached value by key.
   * Returns null if not found or expired.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    try {
      const raw = localStorage.getItem(`hs_cache_${key}`);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      // Check if cache has expired
      if (Date.now() - timestamp > this.TTL_MS) {
        this.remove(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Store a value in the cache.
   * @param {string} key
   * @param {any} data
   */
  set(key, data) {
    try {
      localStorage.setItem(`hs_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch {
      // localStorage quota exceeded — silently ignore
    }
  },

  /**
   * Remove a cached value.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(`hs_cache_${key}`);
    } catch { /* ignore */ }
  },

  /**
   * Clear all HopeScholar cache entries.
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('hs_cache_'))
        .forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
  },
};
