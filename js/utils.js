/* ══════════════════════════════════════════════════════════════
   utils.js — Shared helpers + Input Validation (Bonus: Security)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ── XSS Protection (Bonus: Advanced Security) ──────────────
   Escapes all special HTML characters before any string is
   inserted into the DOM — prevents cross-site scripting attacks. */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Input Validation (Bonus: Advanced Security) ────────────
   Sanitises and validates user input before it is used in
   API requests — prevents injection attacks and bad requests. */
function validateInput(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  // Strip any HTML/script tags
  let clean = str.replace(/<[^>]*>/g, '');
  // Strip special characters that could be used for injection
  clean = clean.replace(/[<>"';&]/g, '');
  // Trim and enforce length limit
  clean = clean.trim().slice(0, maxLength);
  return clean;
}

/** Format large numbers: 1200000 → "1.2M" */
function formatNumber(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toLocaleString();
}

/** Format ISO date string to readable date */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return ''; }
}

/** Truncate string and strip HTML tags */
function truncate(str, max) {
  if (!str) return '';
  const clean = str.replace(/<[^>]*>/g, '');
  return clean.length > max ? clean.slice(0, max) + '…' : clean;
}

/** Debounce: only fire after `wait` ms of inactivity */
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Fetch with timeout — throws on network error or timeout */
async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw err;
  }
}

/** Arrow SVG used in card links */
const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
