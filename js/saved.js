"use strict";

const SK = "hs_saved_v2";

const Saved = {
  items: {},
  init() {
    try {
      const r = localStorage.getItem(SK);
      this.items = r ? JSON.parse(r) : {};
    } catch {
      this.items = {};
    }
    this._badge();
  },
  has(id) {
    return !!this.items[id];
  },
  toggle(id, data, type) {
    if (this.items[id]) {
      delete this.items[id];
      this._btn(id, false);
      showToast("Removed from saved");
    } else {
      this.items[id] = { data, type };
      this._btn(id, true);
      showToast("Saved! View in Saved tab ");
    }
    this._save();
    this._badge();
    if ($("tab-saved")?.classList.contains("active")) this.renderTab();
  },
  remove(id, card) {
    delete this.items[id];
    this._save();
    this._badge();
    if (card) {
      card.style.transition = "opacity .2s,transform .2s";
      card.style.opacity = "0";
      card.style.transform = "scale(.96)";
      setTimeout(() => this.renderTab(), 220);
    } else this.renderTab();
  },
  renderTab() {
    const grid = $("saved-grid"),
      empty = $("saved-empty"),
      keys = Object.keys(this.items);
    if (!keys.length) {
      grid.innerHTML = "";
      showEl(empty);
      return;
    }
    hideEl(empty);
    grid.innerHTML = keys
      .map((id) => {
        const { data, type } = this.items[id];
        return type === "scholarship"
          ? this._scholCard(id, data)
          : this._uniCard(id, data);
      })
      .join("");
  },
  _scholCard(id, s) {
    const catClass =
      { mastercard: "tag-red", fullyfunded: "tag-green", global: "tag-blue" }[
        s.category
      ] || "tag-gray";
    const logoHtml = s.logo
      ? `<img class="card-logo" src="${escapeHtml(s.logo)}" alt="${escapeHtml(s.shortName || s.name)}" onerror="this.style.display='none'" loading="lazy"/><div class="card-logo-placeholder" style="display:none"><span class="card-logo-text">${escapeHtml((s.shortName || s.name).slice(0, 3))}</span></div>`
      : `<div class="card-logo-placeholder"><span class="card-logo-text">${escapeHtml((s.shortName || s.name).slice(0, 3))}</span></div>`;
    return `<article class="schol-card" onclick="Scholarships.openModal(${s.id})">
    <div class="card-logo-area">${logoHtml}</div>
    <h3 class="card-title">${escapeHtml(s.name)}</h3>
    <div class="card-meta">
      <div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(s.city || s.country)}</div>
    </div>
    <div class="card-tags-row"><span class="tag ${catClass}">${s.category === "mastercard" ? "Mastercard" : s.category === "fullyfunded" ? "Fully Funded" : "Global"}</span></div>
    <div class="card-bottom">
      <span class="tag tag-gold"> Saved</span>
      <button class="bm-btn saved" onclick="event.stopPropagation();Saved.remove('${escapeHtml(id)}',this.closest('.schol-card'))" title="Remove"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></button>
    </div>
  </article>`;
  },
  _uniCard(id, u) {
    const initial = (u.name || "")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 3);
    return `<article class="uni-card">
    <div class="card-logo-area"><div class="card-logo-placeholder"><span class="card-logo-text">${escapeHtml(initial)}</span></div></div>
    <h3 class="card-title">${escapeHtml(u.name)}</h3>
    <div class="card-meta"><div class="card-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(u.country || "")}</div></div>
    <div class="card-bottom">
      <span class="tag tag-gold"> Saved</span>
      <div style="display:flex;align-items:center;gap:8px">
        ${u.url ? `<a class="card-link-btn" href="${escapeHtml(u.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Website <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>` : ""}
        <button class="bm-btn saved" onclick="Saved.remove('${escapeHtml(id)}',this.closest('.uni-card'))" title="Remove"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></button>
      </div>
    </div>
  </article>`;
  },
  _save() {
    try {
      localStorage.setItem(SK, JSON.stringify(this.items));
    } catch {}
  },
  _badge() {
    const b = $("saved-badge");
    if (!b) return;
    const c = Object.keys(this.items).length;
    b.textContent = c;
    b.style.display = c > 0 ? "inline-block" : "none";
  },
  _btn(id, saved) {
    document.querySelectorAll(".bm-btn").forEach((b) => {
      if ((b.getAttribute("onclick") || "").includes(id)) {
        b.classList.toggle("saved", saved);
        b.querySelector("svg")?.setAttribute(
          "fill",
          saved ? "currentColor" : "none",
        );
      }
    });
  },
};
