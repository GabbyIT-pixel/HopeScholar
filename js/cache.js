/**
 * Cache Module - Smart API Response Caching (Bonus Feature)
 *
 * This module saves API responses to the browser's localStorage so we don't
 * have to fetch the same data repeatedly. This makes the app much faster
 * and reduces load on the APIs.
 *
 * How it works:
 * - When we fetch data from an API, we store it with a timestamp
 * - Next time we need that data, we check if it's still fresh (under 1 hour old)
 * - If fresh, we use the cached version (instant load!)
 * - If stale/expired, we fetch fresh data from the API
 *
 * TTL = Time To Live (how long cache is valid) = 1 hour
 */
"use strict";

const Cache = {
  // Cache expires after 1 hour (in milliseconds)
  TTL: 60 * 60 * 1000,

  /**
   * Get data from cache if it exists and hasn't expired
   * @param {string} k - Cache key (usually includes what we're caching)
   * @returns {any} The cached data, or null if not found/expired
   */
  get(k) {
    try {
      // Look for cached data in localStorage
      const r = localStorage.getItem("hs_c_" + k);
      if (!r) return null;

      // Parse the stored data and timestamp
      const { d, t } = JSON.parse(r);

      // Check if cache has expired (older than TTL)
      if (Date.now() - t > this.TTL) {
        // Cache is stale - remove it
        localStorage.removeItem("hs_c_" + k);
        return null;
      }

      // Cache is still fresh - return the data
      return d;
    } catch {
      // If anything goes wrong, just return null (no cache)
      return null;
    }
  },

  /**
   * Save data to cache with current timestamp
   * @param {string} k - Cache key
   * @param {any} d - Data to cache
   */
  set(k, d) {
    try {
      // Store data along with current timestamp
      localStorage.setItem("hs_c_" + k, JSON.stringify({ d, t: Date.now() }));
    } catch {
      // If localStorage is full or unavailable, just skip caching
    }
  },

  /**
   * Clear all cached data (useful for debugging or logout)
   */
  clear() {
    try {
      // Find all keys that start with our prefix and remove them
      Object.keys(localStorage)
        .filter((k) => k.startsWith("hs_c_"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // Silently fail if localStorage isn't available
    }
  },
};
