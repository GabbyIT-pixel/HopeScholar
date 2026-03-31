"use strict";

// Escape HTML to prevent XSS
function escapeHtml(s) {
  if (typeof s !== "string") return String(s ?? "");
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#" + "39;");
}

// Sanitize user input
function validateInput(s, max = 100) {
  if (typeof s !== "string") return "";
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'";&]/g, "")
    .trim()
    .slice(0, max);
}

// Format numbers with B/M/K suffixes
function formatNumber(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return n.toLocaleString();
}

// Format date as DD MMM YYYY
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

// Truncate text to max length
function truncate(s, max) {
  if (!s) return "";
  const c = s.replace(/<[^>]*>/g, "");
  return c.length > max ? c.slice(0, max) + "…" : c;
}

// Debounce function
function debounce(fn, wait) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
}

// Fetch with timeout
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

const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
