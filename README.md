# HopeScholar

### _Connecting talented African students to fully funded education worldwide_

> Live at **[gabrielmugisha.tech](https://gabrielmugisha.tech)**

**Author:** Gabriel Mugisha | African Leadership University (ALU) | Software Engineering
**GitHub:** https://github.com/GabbyIT-pixel | **Email:** g.mugisha4@alustudent.com

---

## The Problem We Solve

Millions of talented African students from low-income families never access higher education — not because they lack ability, but because they lack information about 100% free opportunities. HopeScholar puts all those opportunities in one place.

---

## Features

| Tab           | Content                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- |
| Scholarships  | 51 curated scholarships with logos, city, level, funding type — click for full details modal |
| Universities  | Live Hipolabs API data across 12+ African countries                                          |
| Countries     | All 54 sovereign African nations — click to find universities                                |
| Opportunities | RSS news + guaranteed static scholarship opportunities (always works)                        |
| Saved         | Bookmark anything — persists in localStorage                                                 |

---

## APIs Used

| API                                                           | Purpose                         | Key Required |
| ------------------------------------------------------------- | ------------------------------- | ------------ |
| [Hipolabs Universities API](http://universities.hipolabs.com) | Live university data            | No Key       |
| [REST Countries v3](https://restcountries.com)                | African country data with flags | No Key       |
| [RSS2JSON](https://rss2json.com)                              | Live news feed                  | No Key       |

**No API keys** — eliminates any risk of credential exposure.

---

## Project Structure

```
HopeScholar/
├── index.html           App — 5 tabs, sidebar, footer, modal
├── css/style.css        Complete styles
├── js/
│   ├── data.js          51 scholarships with logos, cities, focus areas
│   ├── utils.js         escapeHtml (XSS), validateInput, fetchWithTimeout
│   ├── cache.js         1-hour API caching (Bonus: Performance)
│   ├── ui.js            DOM, tabs, sidebar, toast, modal
│   ├── scholarships.js  Cards with logos + detail modal
│   ├── universities.js  Hipolabs API + detail modal
│   ├── countries.js     REST Countries API (excludes non-sovereign territories)
│   ├── news.js          RSS + static fallback (always shows content)
│   ├── saved.js         localStorage bookmarks
│   ├── prefs.js         Saves last filters (Bonus: Enhanced Features)
│   └── app.js           Entry point
├── nginx.conf           Web01/Web02 + Lb01 load balancer
├── Dockerfile           Docker container (Bonus)
├── .github/workflows/   GitHub Actions CI/CD (Bonus)
└── README.md
```

---

## Bonus Features

1. **Caching** (`cache.js`) — 1-hour localStorage TTL, toast shows "Loaded from cache"
2. **XSS Protection** (`utils.js`) — `escapeHtml()` on every API string
3. **Input Validation** (`utils.js`) — `validateInput()` strips injection chars
4. **User Preferences** (`prefs.js`) — restores last selected filters on revisit
5. **Docker** (`Dockerfile`) — `docker build -t hopescholar . && docker run -p 8080:80 hopescholar`
6. **CI/CD** (`.github/workflows/deploy.yml`) — auto-deploys on every `git push`

---

## Running Locally

```bash
git clone https://github.com/GabbyIT-pixel/HopeScholar.git
cd HopeScholar
open index.html          # or: npx serve .
```

---

## Deployment

```bash
# Web01
ssh -i ~/.ssh/school ubuntu@54.227.215.118
sudo apt install -y nginx && sudo mkdir -p /var/www/hopescholar
# Upload files, configure nginx.conf, reload

# Lb01 — point DNS first, then:
sudo certbot --nginx -d gabrielmugisha.tech -d www.gabrielmugisha.tech
# Configure nginx upstream, reload

# Test
curl http://54.227.215.118/health    # OK
curl http://3.83.142.166/health      # OK
curl https://gabrielmugisha.tech/health  # LB OK
```

---

## Security

- `escapeHtml()` — all API content sanitised before DOM insertion
- `validateInput()` — user inputs sanitised before API calls
- No API keys — zero credential exposure risk
- HTTPS on load balancer via Let's Encrypt
- Security headers: HSTS, X-Frame-Options, X-Content-Type-Options

---

_African Leadership University · Web Infrastructure & APIs Assignment · 2025_
_Credit: Hipo Labs · REST Countries · RSS2JSON · Mastercard Foundation · Plus Jakarta Sans_
