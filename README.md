# 🌍 HopeScholar
### *Connecting talented African students to fully funded education worldwide*

> Live at **[gabrielmugisha.tech](https://gabrielmugisha.tech)**

HopeScholar is a web application built to solve a real problem faced by students from **poor communities across Africa** — the lack of a single, reliable place to discover fully funded scholarships and universities that cost absolutely nothing.

**Author:** Gabriel Mugisha | African Leadership University (ALU) | Software Engineering
**Email:** g.mugisha4@alustudent
**GitHub:** https://github.com/GabbyIT-pixel

---

## 🎯 The Problem We Solve

Millions of talented African students from low-income families never access higher education — not because they lack ability, but because they lack information about opportunities that are 100% free. HopeScholar puts all those opportunities in one place, with direct links to official university websites so students can apply at no cost.

---

## 🌟 What the App Does

| Tab | Content |
|---|---|
| 🎓 Scholarships | 50 curated fully funded scholarships with search, filter by category/region, and sort |
| 🏫 Universities | Live university data from Hipolabs API — search across 12+ African countries |
| 🌍 Countries | All 54 African nations with flags, capitals, population — click to find universities |
| 📰 Opportunities | Live education news via BBC Education RSS feed with keyword search |
| 🔖 Saved | Bookmark scholarships and universities — persists across sessions |

---

## 🌐 APIs Used

| API | Purpose | Documentation | Key Required |
|---|---|---|---|
| [Hipolabs Universities API](http://universities.hipolabs.com) | Live university listings by country | [GitHub Docs](https://github.com/Hipo/university-domains-list-api) | ❌ None |
| [REST Countries v3](https://restcountries.com) | African country data with flags | [restcountries.com](https://restcountries.com/#api-endpoints-v3) | ❌ None |
| [RSS2JSON](https://rss2json.com) + BBC Education RSS | Live education news feed | [rss2json.com/docs](https://rss2json.com/docs) | ❌ None |

> **API Key Security:** All APIs are public and require no credentials. This is intentional — it eliminates any risk of key exposure, which is the most secure approach for a client-side application. No keys to expose, no keys to leak.

**Credit:** Hipo Labs · REST Countries contributors · RSS2JSON · BBC News Education · Mastercard Foundation

---

## 📁 Project Structure

```
HopeScholar/
├── index.html                  Main application (5 tabs + sidebar)
├── css/
│   └── style.css               All styles — layout, cards, responsive, animations
├── js/
│   ├── data.js                 50 curated scholarships with real official links
│   ├── utils.js                escapeHtml (XSS), validateInput, fetchWithTimeout, debounce
│   ├── cache.js                API response caching with 1-hour TTL (Bonus)
│   ├── ui.js                   DOM helpers, showLoader, showError, tab routing, toast
│   ├── scholarships.js         Filter by category/region, sort, render
│   ├── universities.js         Live Hipolabs API, cached, filter, sort, render
│   ├── countries.js            Live REST Countries API, cached, filter, sort, render
│   ├── news.js                 BBC Education RSS, cached, keyword filter, render
│   ├── saved.js                localStorage bookmark management
│   ├── prefs.js                User preferences — saves last filters (Bonus)
│   └── app.js                  Entry point — init modules, tab routing, shortcuts
├── nginx.conf                  Nginx config for Web01/Web02 + Lb01 load balancer
├── Dockerfile                  Docker container config (Bonus)
├── docker-compose.yml          Docker Compose setup (Bonus)
├── docker-nginx.conf           Nginx config inside Docker container (Bonus)
├── .github/
│   └── workflows/
│       └── deploy.yml          GitHub Actions CI/CD pipeline (Bonus)
├── .gitignore
└── README.md
```

---

## ✨ Core Features

- 50 curated scholarships — Mastercard Foundation, Work Colleges, Ivy League, Global programs
- Filter by category: Mastercard Foundation / Fully Funded / Global Scholarships
- Filter by region: Africa / USA / UK / Europe / Canada / Other
- Sort by name A→Z, Z→A, or by country
- Live university search via Hipolabs API across 12+ African countries
- All 54 African countries with flags, population, sub-region filter
- Click any country → instantly load its universities
- Live education news from BBC Education RSS with keyword search + topic chips
- Bookmark scholarships and universities — persists in localStorage
- Live bookmark badge counter in sidebar
- Skeleton loading animations while data fetches
- Error handling — friendly messages for API failures and timeouts
- Keyboard shortcut: `Ctrl+K` focuses scholarship search
- Fully responsive — sidebar collapses to mobile drawer on screens ≤960px

---

## 🏆 Bonus Features Implemented

### 1. API Response Caching — Performance (`js/cache.js`)
All three API responses are cached in `localStorage` with a **1-hour TTL**. Repeat visits load data instantly without hitting the API again. A toast notification shows "Loaded from cache ⚡" when cached data is used.

```javascript
// Check cache before fetching
const cached = Cache.get('african_countries');
if (cached) { this.data = cached; this.render(); return; }
// Store response in cache after fetching
Cache.set('african_countries', json);
```

### 2. XSS Protection — Advanced Security (`js/utils.js`)
Every string from API responses passes through `escapeHtml()` before being inserted into the DOM. This prevents cross-site scripting attacks.

```javascript
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
```

### 3. Input Validation — Advanced Security (`js/utils.js`)
All user-supplied search inputs are sanitised via `validateInput()` before being used in API requests — strips HTML tags, special characters, and enforces length limits.

```javascript
function validateInput(str, maxLength = 100) {
  let clean = str.replace(/<[^>]*>/g, '');       // strip HTML tags
  clean = clean.replace(/[<>"';&]/g, '');          // strip injection chars
  return clean.trim().slice(0, maxLength);          // enforce length limit
}
```

### 4. User Preferences — Enhanced Features (`js/prefs.js`)
The app remembers the user's last selected country, region filter, and sort preferences in `localStorage`. The next time they open the app, their filters are automatically restored.

### 5. Docker Containerisation — Scalability (`Dockerfile`, `docker-compose.yml`)
The app can be run inside a Docker container using Nginx Alpine — lightweight, portable, and production-ready.

```bash
docker-compose up -d
# App runs at http://localhost:8080
```

### 6. CI/CD Pipeline — GitHub Actions (`.github/workflows/deploy.yml`)
Every push to the `main` branch automatically deploys to Web01 and Web02 via SSH, then verifies both servers respond correctly.

---

## 🚀 Running Locally

No installation or build step needed — pure static site.

```bash
# 1. Clone the repository
git clone https://github.com/GabbyIT-pixel/HopeScholar.git
cd HopeScholar

# 2a. Open directly in browser
open index.html        # macOS
start index.html       # Windows

# 2b. Use a local server (recommended — avoids CORS edge cases)
npx serve .
# Open http://localhost:3000

# 2c. Run with Docker (Bonus)
docker-compose up -d
# Open http://localhost:8080
```

---

## ☁️ Deployment Guide

### Step 1 — Deploy on Web01 (54.227.215.118)

```bash
# SSH into Web01
ssh -i ~/.ssh/school ubuntu@54.227.215.118

# Install Nginx
sudo apt update && sudo apt install -y nginx

# Create web root
sudo mkdir -p /var/www/hopescholar
exit

# Upload files from your local machine
scp -r ./* ubuntu@54.227.215.118:/var/www/hopescholar/

# SSH back in and configure Nginx
ssh -i ~/.ssh/school ubuntu@54.227.215.118
sudo nano /etc/nginx/sites-available/hopescholar
# Paste the Web01/Web02 block from nginx.conf

sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Verify
curl http://54.227.215.118/health    # → OK
```

### Step 2 — Deploy on Web02 (3.83.142.166)

Repeat all of Step 1 exactly, replacing `54.227.215.118` with `3.83.142.166`.

### Step 3 — Configure Load Balancer on Lb01 (98.81.221.12)

```bash
# SSH into Lb01
ssh -i ~/.ssh/school ubuntu@98.81.221.12

# Install Nginx and Certbot
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

# IMPORTANT: Point gabrielmugisha.tech A record → 98.81.221.12
# in your domain registrar BEFORE running certbot

# Get free SSL certificate
sudo certbot --nginx -d gabrielmugisha.tech -d www.gabrielmugisha.tech

# Configure load balancer
sudo nano /etc/nginx/sites-available/hopescholar
# Paste the Lb01 block from nginx.conf

sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Step 4 — Set Up CI/CD (GitHub Actions — Bonus)

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `SSH_PRIVATE_KEY` → paste the full content of your `~/.ssh/school` private key
   - `WEB01_IP` → `54.227.215.118`
   - `WEB02_IP` → `3.83.142.166`
3. Every `git push` to `main` will now automatically deploy to both servers

### Step 5 — Test Everything

```bash
# Both web servers respond
curl http://54.227.215.118/health    # → OK
curl http://3.83.142.166/health      # → OK

# HTTPS and load balancer work
curl https://gabrielmugisha.tech/health   # → LB OK

# HTTP redirects to HTTPS
curl -I http://gabrielmugisha.tech        # → 301 Moved Permanently

# Load balancing hits both servers
for i in {1..6}; do curl -s https://gabrielmugisha.tech/health; done
```

---

## 🔒 Security Implementation

| Security Measure | Implementation |
|---|---|
| XSS Protection | `escapeHtml()` in `utils.js` — applied to every API string before DOM insertion |
| Input Validation | `validateInput()` in `utils.js` — strips HTML, special chars, enforces length limits |
| No API keys | All 3 APIs are public and credential-free — zero exposure risk |
| HTTPS | Let's Encrypt certificate on Lb01 — HTTP auto-redirects to HTTPS |
| Security headers | `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` in Nginx |
| `.gitignore` | Excludes `.env`, `.pem`, `.key`, log files from version control |

---

## 🧩 Challenges & Solutions

| Challenge | Solution |
|---|---|
| Finding reliable APIs with no secret keys | Used 3 well-known public APIs — Hipolabs, REST Countries, BBC RSS via RSS2JSON |
| XSS risk from third-party API content | `escapeHtml()` in `utils.js` sanitises every string before DOM insertion |
| Slow repeat API calls | `cache.js` stores responses in localStorage with 1-hour TTL |
| Organising a large JavaScript codebase | Split into 11 focused files with single responsibilities |
| Application window accuracy | Removed open/closed labels — cards link directly to official websites |
| User experience on repeat visits | `prefs.js` saves and restores last selected filters automatically |

---

## 📹 Demo Video

[Add YouTube or Vimeo link — strictly max 2 minutes]

**What to show in the video:**
1. Open `index.html` locally — show scholarships tab, search, filter, sort
2. Switch to Universities — search a country, sort results
3. Switch to Countries — filter by region, click a country to jump to universities
4. Switch to Opportunities — use chips and keyword search
5. Save a scholarship — show saved tab with bookmark count
6. Open `https://gabrielmugisha.tech` — show same app live
7. Run `curl http://54.227.215.118/health` and `curl http://3.83.142.166/health` — prove both servers work

---

## 📜 Credits & Attribution

- **Hipo Labs** — Universities API (hipolabs.com)
- **REST Countries** — Country data API (restcountries.com)
- **RSS2JSON** — RSS to JSON conversion (rss2json.com)
- **BBC News Education** — Education RSS news feed
- **Mastercard Foundation** — Scholarship program data source
- **Plus Jakarta Sans** — Google Fonts typography

*Built for the Web Infrastructure & APIs assignment — African Leadership University 2025*
