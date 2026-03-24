# 🌍 HopeScholar
### *Connecting talented African students to fully funded education worldwide*

> 🔴 **Live at [gabrielmugisha.tech](https://gabrielmugisha.tech)**

HopeScholar is a professional web application built to solve a real problem faced by students from **poor communities across Africa** — the lack of a single, reliable place to discover fully funded scholarships and universities that cost absolutely nothing.

**Author:** Gabriel Mugisha | African Leadership University (ALU) | Software Engineering
**Email:** g.mugisha4@alustudent.com
**GitHub:** https://github.com/GabbyIT-pixel
**Live:** https://gabrielmugisha.tech

---

## 🎯 The Problem We Solve

Millions of talented African students from low-income families never access higher education — not because they lack ability, but because they lack information about opportunities that are 100% free. HopeScholar puts all those opportunities in one place, with clean cards, detail modals, and direct links to official university websites.

---

## 🌟 Features

| Tab | What it does |
|---|---|
| 🎓 **Scholarships** | 51 curated fully funded scholarships — search, filter by category/region, sort. Click any card for full details in a modal popup. |
| 🏫 **Universities** | Live university data from Hipolabs API — 12+ African countries, search, sort, click for details. |
| 🌍 **Countries** | All 54 African sovereign nations with flags — filter, sort, click to find universities. |
| 📰 **Opportunities** | Live education news from RSS feeds with static fallback — always shows content. |
| 🔖 **Saved** | Bookmark anything — persists across sessions in localStorage. |

---

## 🌐 APIs Used

| API | Used For | Documentation | Key Required |
|---|---|---|---|
| [Hipolabs Universities API](http://universities.hipolabs.com) | Live university data by country | [GitHub](https://github.com/Hipo/university-domains-list-api) | ❌ None |
| [REST Countries v3](https://restcountries.com) | All African nations with flags & data | [Docs](https://restcountries.com/#api-endpoints-v3) | ❌ None |
| [RSS2JSON](https://rss2json.com) + Education RSS | Live news & opportunities | [Docs](https://rss2json.com/docs) | ❌ None |

> **Security:** All 3 APIs are public — no credentials needed. This eliminates any risk of API key exposure, the most secure approach for a client-side application.

**Credits:** Hipo Labs · REST Countries contributors · RSS2JSON · BBC/Guardian Education · Mastercard Foundation

---

## 📁 Project Structure

```
HopeScholar/
├── index.html                    Full app — 5 tabs, sidebar, footer, modal
├── css/
│   └── style.css                 Complete styles — layout, cards, modal, footer, responsive
├── js/
│   ├── data.js                   51 curated scholarships with real links
│   ├── utils.js                  escapeHtml (XSS), validateInput, fetchWithTimeout, debounce
│   ├── cache.js                  API caching with 1-hour TTL (Bonus: Performance)
│   ├── ui.js                     DOM helpers, tab routing, sidebar, toast, modal close
│   ├── scholarships.js           Filter, sort, render cards + detail modal
│   ├── universities.js           Hipolabs API + cache, filter, sort, detail modal
│   ├── countries.js              REST Countries API + cache, filter, sort, territory exclusion
│   ├── news.js                   RSS feeds + static fallback (always works)
│   ├── saved.js                  localStorage bookmarks + badge counter
│   ├── prefs.js                  User preferences — restores last filters (Bonus)
│   └── app.js                    Entry point — init, tab routing, keyboard shortcuts
├── nginx.conf                    Web01/Web02 static + Lb01 HTTPS load balancer config
├── Dockerfile                    Docker container (Bonus: Containerisation)
├── docker-compose.yml            Docker Compose setup (Bonus)
├── docker-nginx.conf             Nginx config inside Docker
├── .github/
│   └── workflows/
│       └── deploy.yml            GitHub Actions auto-deploy (Bonus: CI/CD)
├── .gitignore
└── README.md
```

---

## 🏆 Bonus Features

### ① API Caching — Performance (`js/cache.js`)
All API responses stored in `localStorage` with 1-hour TTL. Repeat visits load instantly. Toast notification shows "Loaded from cache ⚡".

### ② XSS Protection — Security (`js/utils.js`)
`escapeHtml()` applied to every API string before DOM insertion. Prevents cross-site scripting attacks.

### ③ Input Validation — Security (`js/utils.js`)
`validateInput()` strips HTML tags, special characters, and enforces length limits before any user input reaches API calls.

### ④ User Preferences — Enhanced Features (`js/prefs.js`)
Last selected filters (country, region, sort) saved to localStorage and auto-restored on next visit.

### ⑤ Detail Modal — UX Enhancement
Cards are clean and minimal. Click any card → smooth animated modal shows full details + official website button.

### ⑥ Docker Containerisation — Scalability (`Dockerfile`)
```bash
docker-compose up -d
# App runs at http://localhost:8080
```

### ⑦ CI/CD Pipeline — GitHub Actions (`.github/workflows/deploy.yml`)
Every `git push` to `main` auto-deploys to Web01 and Web02 via SSH.

---

## 🚀 Running Locally

```bash
# 1. Clone
git clone https://github.com/GabbyIT-pixel/HopeScholar.git
cd HopeScholar

# 2a. Open directly
open index.html          # macOS
start index.html         # Windows

# 2b. Local server (recommended)
npx serve .
# → http://localhost:3000

# 2c. Docker (Bonus)
docker-compose up -d
# → http://localhost:8080
```

---

## ☁️ Deployment Guide

### Step 1 — Web01 (54.227.215.118)
```bash
ssh -i ~/.ssh/school ubuntu@54.227.215.118
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/hopescholar
exit

# Upload files
scp -r ./* ubuntu@54.227.215.118:/var/www/hopescholar/

# Configure Nginx
ssh -i ~/.ssh/school ubuntu@54.227.215.118
sudo nano /etc/nginx/sites-available/hopescholar
# Paste Web01/Web02 block from nginx.conf

sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
curl http://54.227.215.118/health   # → OK
```

### Step 2 — Web02 (3.83.142.166)
Repeat Step 1 replacing `54.227.215.118` with `3.83.142.166`.

### Step 3 — Load Balancer Lb01 (98.81.221.12)
```bash
ssh -i ~/.ssh/school ubuntu@98.81.221.12
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

# Point gabrielmugisha.tech A record → 98.81.221.12 FIRST

sudo certbot --nginx -d gabrielmugisha.tech -d www.gabrielmugisha.tech
sudo nano /etc/nginx/sites-available/hopescholar
# Paste Lb01 block from nginx.conf

sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Step 4 — CI/CD Setup (Bonus)
GitHub → Settings → Secrets → Actions → New secret:
- `SSH_PRIVATE_KEY` → paste `~/.ssh/school` content
- `WEB01_IP` → `54.227.215.118`
- `WEB02_IP` → `3.83.142.166`

Every `git push` to `main` now auto-deploys to both servers.

### Step 5 — Test Everything
```bash
curl http://54.227.215.118/health           # → OK
curl http://3.83.142.166/health             # → OK
curl https://gabrielmugisha.tech/health     # → LB OK
curl -I http://gabrielmugisha.tech          # → 301 (HTTPS redirect)
for i in {1..6}; do curl -s https://gabrielmugisha.tech/health; done  # Load balancing
```

---

## 🔒 Security Implementation

| Measure | Implementation |
|---|---|
| XSS Protection | `escapeHtml()` — every API string sanitised before DOM insertion |
| Input Validation | `validateInput()` — strips HTML/special chars, enforces length limits |
| No API Keys | All 3 APIs are public — zero credential exposure risk |
| HTTPS | Let's Encrypt on Lb01 — HTTP auto-redirects to HTTPS |
| Security Headers | HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff |
| .gitignore | Excludes `.env`, `.pem`, `.key`, log files |

---

## 🧩 Challenges & Solutions

| Challenge | Solution |
|---|---|
| RSS2JSON returning HTTP 422 | Built 3-layer fallback: try 3 RSS feeds, then show 12 curated static opportunities |
| REST Countries including territories | Excluded non-sovereign territories (British Indian Ocean Territory, etc.) |
| Cards showing too much information | Redesigned to clean minimal cards — full details in animated modal popup |
| Slow repeat API calls | `cache.js` stores responses in localStorage with 1-hour TTL |
| XSS from API content | `escapeHtml()` in utils.js sanitises every string before DOM insertion |
| User losing filter settings | `prefs.js` saves and auto-restores last selected filters |

---

## 📹 Demo Video
[Add link — max 2 minutes]

**Script:**
1. Open locally → show scholarships, search, filter, click card for modal
2. Universities → select country, search, click card
3. Countries → filter by region, click country → jumps to universities
4. Opportunities → use topic chips
5. Save a scholarship → show Saved tab
6. Open `https://gabrielmugisha.tech` → same app live
7. `curl http://54.227.215.118/health` and `curl http://3.83.142.166/health`

---

## 📜 Credits

- **Hipo Labs** — Universities API (hipolabs.com)
- **REST Countries** — Country data API (restcountries.com)
- **RSS2JSON** — RSS to JSON conversion (rss2json.com)
- **Mastercard Foundation** — Scholarship program data
- **Plus Jakarta Sans** — Google Fonts

*African Leadership University · Web Infrastructure & APIs Assignment · 2025*
