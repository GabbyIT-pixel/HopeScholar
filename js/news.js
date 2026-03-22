/* ══════════════════════════════════════════════════════════════
   news.js — Fetch and render education news & opportunities
   API:    RSS2JSON + BBC Education RSS (free, no key required)
   Docs:   https://rss2json.com
   Bonus:  API responses cached in localStorage (cache.js)
   Project: HopeScholar
   Author:  Gabriel Mugisha | ALU | gabrielmugisha.tech
   ══════════════════════════════════════════════════════════════ */

'use strict';

const News = {
  data:    [],
  current: 'scholarship Africa students',

  async load(query) {
    // Input validation (Bonus: Security)
    this.current = validateInput(query || $('news-search').value.trim() || 'scholarship Africa students', 100);

    clearError('news');
    showLoader('news');
    this._syncChips();

    // ── Check cache first (Bonus: Performance) ──────────────
    const cacheKey = `news_${this.current}`;
    const cached   = Cache.get(cacheKey);
    if (cached) {
      this.data = cached;
      hideLoader('news');
      this.render();
      showToast('Loaded from cache ⚡');
      return;
    }

    const feed = 'https://feeds.bbci.co.uk/news/education/rss.xml';
    const url  = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=30`;

    try {
      const res  = await fetchWithTimeout(url);
      const json = await res.json();

      if (json.status !== 'ok' || !Array.isArray(json.items)) {
        throw new Error('News feed returned an unexpected response.');
      }

      const keyword  = this.current.toLowerCase().split(' ')[0];
      const filtered = json.items.filter(i =>
        (i.title + ' ' + (i.description || '')).toLowerCase().includes(keyword)
      );
      const articles = (filtered.length >= 3 ? filtered : json.items).slice(0, 15);

      // Store in cache (Bonus: Performance)
      Cache.set(cacheKey, articles);

      this.data = articles;
      hideLoader('news');
      this.render();
    } catch (err) {
      hideLoader('news');
      showError('news', `Could not load news: ${err.message}`);
    }
  },

  render() {
    const grid = $('news-grid');
    showStats('news', `${this.data.length} article${this.data.length !== 1 ? 's' : ''} found`);

    if (!this.data.length) {
      grid.innerHTML = emptyStateHtml('📰', 'No articles found', 'Try a different keyword or use the quick topic buttons above.');
      return;
    }

    grid.innerHTML = this.data.map(item => this._cardHtml(item)).join('');
  },

  _cardHtml(item) {
    const title   = escapeHtml(item.title || 'Untitled');
    const desc    = escapeHtml(truncate(item.description || item.content || '', 160));
    const url     = item.link || '#';
    const img     = item.thumbnail || item.enclosure?.link || null;
    const source  = escapeHtml(item.author || 'BBC Education');
    const dateStr = formatDate(item.pubDate);

    const imgHtml = img
      ? `<img class="news-thumb" src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'news-placeholder\\'>📰</div>'">`
      : `<div class="news-placeholder" aria-hidden="true">📰</div>`;

    return `
      <article class="news-card" role="listitem">
        ${imgHtml}
        <div class="news-body">
          <div class="news-meta">
            <span class="news-source">${source}</span>
            ${dateStr ? `<span class="news-date">${dateStr}</span>` : ''}
          </div>
          <h3 class="news-title">${title}</h3>
          ${desc ? `<p class="news-desc">${desc}</p>` : ''}
          <a class="card-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
            Read full article ${ARROW_SVG}
          </a>
        </div>
      </article>`;
  },

  _syncChips() {
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('active', c.dataset.q === this.current);
    });
  },
};

document.addEventListener('DOMContentLoaded', () => {
  $('news-fetch-btn')?.addEventListener('click', () => News.load($('news-search').value.trim()));
  $('news-search')?.addEventListener('keydown', e => { if (e.key === 'Enter') News.load($('news-search').value.trim()); });
  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      $('news-search').value = btn.dataset.q;
      News.load(btn.dataset.q);
    });
  });
});
