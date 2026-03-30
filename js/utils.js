/**
 * utils.js — HopeScholar Utility Functions + Security
 *
 * This module provides essential helper functions and security utilities
 * used throughout the HopeScholar application.
 *
 * Security Features:
 * - XSS Protection: escapeHtml() sanitizes all user input and API responses
 * - Input Validation: validateInput() prevents injection attacks
 * - Timeout Handling: fetchWithTimeout() prevents hanging requests
 *
 * @author Gabriel Mugisha
 * @project HopeScholar
 */
"use strict";

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * All API responses and user input must pass through this before DOM insertion.
 *
 * @param {string} s - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 * @example escapeHtml('<script>alert("xss")</script>') // returns '<script>...'
 */
function escapeHtml(s) {
  if (typeof s !== "string") return String(s ?? "");
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#" + "39;");
}

/**
 * Validates and sanitizes user input to prevent injection attacks.
 * Removes HTML tags and special characters that could be used for XSS/SQL injection.
 *
 * @param {string} s - Input string to validate
 * @param {number} max - Maximum length (default: 100)
 * @returns {string} Sanitized string
 */
function validateInput(s, max = 100) {
  if (typeof s !== "string") return "";
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'";&]/g, "")
    .trim()
    .slice(0, max);
}

/**
 * Formats large numbers with B/M/K suffixes for readability.
 * @param {number} n - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return n.toLocaleString();
}

/**
 * Formats date string to human-readable format (DD MMM YYYY).
 * @param {string} d - Date string
 * @returns {string} Formatted date
 */
function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Truncates text to specified length, removing HTML tags first.
 * @param {string} s - Text to truncate
 * @param {number} max - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncate(s, max) {
  if (!s) return "";
  const c = s.replace(/<[^>]*>/g, "");
  return c.length > max ? c.slice(0, max) + "…" : c;
}

/**
 * Creates a debounced version of a function.
 * Prevents excessive API calls during rapid user input (e.g., search typing).
 *
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(fn, wait) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
}

/**
 * Fetches a URL with a timeout to prevent hanging requests.
 * Implements AbortController for clean cancellation.
 *
 * @param {string} url - URL to fetch
 * @param {number} ms - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If request times out or fails
 */
async function fetchWithTimeout(url, ms = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r;
  } catch (e) {
    clearTimeout(id);
    if (e.name === "AbortError") {
      throw new Error("Request timed out. Check your internet connection.");
    }
    throw e;
  }
}

/** Arrow SVG icon constant used throughout the UI */
const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
