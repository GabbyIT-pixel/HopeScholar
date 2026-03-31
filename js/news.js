"use strict";

const News = {
  data: [],
  current: "scholarship Africa",

  FEEDS: [
    "https://www.scidev.net/sub-saharan-africa/feed/",
    "https://www.universityworldnews.com/rss.php",
  ],

  // Fallback when RSS fails
  STATIC: [
    {
      title: "Mastercard Foundation Scholars Program 2025 — Apply Now",
      description:
        "Fully funded scholarships for young Africans at 50+ partner universities across Africa and globally. Covers tuition, accommodation, meals and transport. For students who cannot afford education.",
      link: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/",
      author: "Mastercard Foundation",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Chevening Scholarships 2025-2026 — UK Government Fully Funded",
      description:
        "The UK government's global scholarship for future leaders. Full funding to study a one-year master's degree at any UK university. Open to African students.",
      link: "https://www.chevening.org",
      author: "UK Foreign Office",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title:
        "Gates Cambridge Scholarship — Full Funding at Cambridge University",
      description:
        "Bill Gates-funded fully-funded scholarships for outstanding international students to pursue postgraduate study at the University of Cambridge, UK.",
      link: "https://www.gatescambridge.org",
      author: "Gates Cambridge Trust",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Fulbright Foreign Student Program — Study in the USA Free",
      description:
        "US government's flagship international scholarship. Full funding for graduate students from Africa to study and conduct research at top US universities.",
      link: "https://foreign.fulbrightonline.org",
      author: "US Department of State",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Erasmus Mundus Joint Masters 2025 — Free Study Across Europe",
      description:
        "EU-funded scholarships to study in multiple European countries. Full tuition + monthly living allowance + travel costs covered by the European Commission.",
      link: "https://ec.europa.eu/education/external-activities/erasmus-mundus_en",
      author: "European Commission",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "DAAD Scholarships 2025 — Fully Funded Study in Germany",
      description:
        "German government scholarships for international students. Covers full tuition, monthly stipend, health insurance and travel costs to Germany.",
      link: "https://www.daad.de/en/",
      author: "DAAD Germany",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Commonwealth Scholarships 2025 — Fully Funded Study in UK",
      description:
        "For citizens of Commonwealth countries including most African nations. Full funding for postgraduate study and PhD research in the United Kingdom.",
      link: "https://cscuk.fcdo.gov.uk",
      author: "Commonwealth Scholarship Commission",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Berea College — 100% Free Tuition for Every Student",
      description:
        "Every admitted student receives a full Tuition Promise Scholarship covering four years of undergraduate study. The best guaranteed zero-cost option for African students from poor families.",
      link: "https://www.berea.edu",
      author: "Berea College",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title:
        "Carnegie Mellon University Africa — Postgraduate Tech Scholarships in Rwanda",
      description:
        "CMU Africa in Kigali, Rwanda offers master's degrees in software engineering, AI, data science and cybersecurity — fully funded through the Mastercard Foundation.",
      link: "https://africa.engineering.cmu.edu",
      author: "CMU Africa",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title: "Oxford AfOx Scholarship — Specifically for African Students",
      description:
        "The Africa Oxford Initiative (AfOx) provides fully funded scholarships specifically for African students to study postgraduate programmes at the University of Oxford.",
      link: "https://www.ox.ac.uk/clarendon",
      author: "University of Oxford",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title:
        "Harvard University — Meets 100% of Financial Need for All Students",
      description:
        "Harvard meets the full demonstrated financial need of every admitted student. Students from families earning under $75,000/year typically pay nothing at all.",
      link: "https://www.harvard.edu",
      author: "Harvard University",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
    {
      title:
        "Princeton University — No-Loan Policy for All International Students",
      description:
        "Princeton replaces all loans with grants. One of the most generous financial aid programs in the world — international students from low-income families pay little to nothing.",
      link: "https://www.princeton.edu",
      author: "Princeton University",
      pubDate: new Date().toISOString(),
      thumbnail: null,
    },
  ],
  async load(query) {
    this.current = validateInput(
      query || $("news-search").value.trim() || "scholarship Africa",
      100,
    );
    clearError("news");
    showLoader("news");
    this._syncChips();
    const ck = `news_${this.current}`;
    const cached = Cache.get(ck);
    if (cached) {
      this.data = cached;
      hideLoader("news");
      this.render();
      showToast("Loaded from cache");
      return;
    }
    let articles = null;
    for (const feed of this.FEEDS) {
      try {
        articles = await this._fetch(feed, this.current);
        if (articles?.length > 0) break;
      } catch {
        continue;
      }
    }
    if (!articles || !articles.length) {
      const kw = this.current.toLowerCase().split(" ")[0];
      const f = this.STATIC.filter((a) =>
        (a.title + " " + a.description).toLowerCase().includes(kw),
      );
      articles = f.length >= 3 ? f : this.STATIC;
    }
    Cache.set(ck, articles);
    this.data = articles;
    hideLoader("news");
    this.render();
  },
  async _fetch(feedUrl, query) {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=20`;
    const res = await fetchWithTimeout(url, 8000);
    const json = await res.json();
    if (
      json.status !== "ok" ||
      !Array.isArray(json.items) ||
      !json.items.length
    )
      throw new Error("Feed failed");
    const kw = query.toLowerCase().split(" ")[0];
    const f = json.items.filter((i) =>
      (i.title + " " + (i.description || "")).toLowerCase().includes(kw),
    );
    return (f.length >= 2 ? f : json.items).slice(0, 12);
  },
  render() {
    const grid = $("news-grid");
    showStats(
      "news",
      `${this.data.length} opportunit${this.data.length !== 1 ? "ies" : "y"} found`,
    );
    if (!this.data.length) {
      grid.innerHTML = emptyHtml(
        "News",
        "No opportunities found",
        "Try a different keyword or click a topic button above.",
      );
      return;
    }
    grid.innerHTML = this.data.map((item) => this._card(item)).join("");
  },
  _card(item) {
    const title = escapeHtml(item.title || "Untitled");
    const desc = escapeHtml(
      truncate(item.description || item.content || "", 200),
    );
    const url = item.link || "#";
    const img = item.thumbnail || item.enclosure?.link || null;
    const source = escapeHtml(item.author || "HopeScholar");
    const date = formatDate(item.pubDate);
    const imgHtml = img
      ? `<img class="news-thumb" src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'news-placeholder\\'>N</div>'">`
      : `<div class="news-placeholder">N</div>`;
    return `<article class="news-card">
    ${imgHtml}
    <div class="news-body">
      <div class="news-meta"><span class="news-source">${source}</span>${date ? `<span class="news-date">${date}</span>` : ""}</div>
      <h3 class="news-title">${title}</h3>
      ${desc ? `<p class="news-desc">${desc}</p>` : ""}
      <a class="news-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">View Opportunity <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
  </article>`;
  },
  _syncChips() {
    document
      .querySelectorAll(".chip")
      .forEach((c) =>
        c.classList.toggle("active", c.dataset.q === this.current),
      );
  },
};
document.addEventListener("DOMContentLoaded", () => {
  $("news-fetch-btn")?.addEventListener("click", () =>
    News.load($("news-search").value.trim()),
  );
  $("news-search")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") News.load($("news-search").value.trim());
  });
  document.querySelectorAll(".chip").forEach((b) =>
    b.addEventListener("click", () => {
      $("news-search").value = b.dataset.q;
      News.load(b.dataset.q);
    }),
  );
});
