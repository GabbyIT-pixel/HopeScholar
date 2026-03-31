# HopeScholar

### _Connecting talented African students to fully funded education worldwide_

> Live at **[www.gabrielmugisha.tech](https://gabrielmugisha.tech)**

**Author:** Gabriel Mugisha | African Leadership University (ALU) | Software Engineering
**GitHub:** https://github.com/GabbyIT-pixel | **Email:** g.mugisha4@alustudent.com

---

## The Problem We Solve

Millions of talented African students from low-income families never access higher education — not because they lack ability, but because they lack information about 100% free opportunities. HopeScholar puts all those opportunities in one place.

## Demo

Watch a demo of HopeScholar in action: [Demo Video](https://youtu.be/22K1I6Pc_hE)


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
├── Dockerfile           Docker container for deployment
├── docker-compose.yml   Multi-container setup (web servers + load balancer)
├── .github/workflows/   GitHub Actions CI/CD pipeline
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
7. **Load Balancer** — Deployed on Web01 + Web02 with Lb01 distributing traffic

---

## Running Locally

```bash
git clone https://github.com/GabbyIT-pixel/HopeScholar.git
cd HopeScholar
open index.html          # or: npx serve .
```

---

## Deployment

### Live Application
**URL:** [https://gabrielmugisha.tech](https://gabrielmugisha.tech)

The application is deployed on Web01 and Web02 servers with a load balancer (Lb01) distributing traffic between them.

### How It Was Deployed

#### 1. Web01 Server (`54.227.215.118`)
```bash
ssh -i $SSH_KEY ubuntu@54.227.215.118
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/hopescholar

# Upload project files
cp -r * /var/www/hopescholar/

# Configure nginx
sudo nano /etc/nginx/sites-available/hopescholar
```

**Nginx Configuration (`/etc/nginx/sites-available/hopescholar`):**
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/hopescholar;
    index index.html index.htm app.html;
    server_name _;
    add_header X-Served-By "6983-web-01";
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

#### 2. Web02 Server (`3.83.142.166`)
```bash
ssh -i $SSH_KEY ubuntu@3.83.142.166
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/hopescholar
cp -r * /var/www/hopescholar/
```

**Nginx Configuration (`/etc/nginx/sites-available/hopescholar`):**
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html seed.json app.html;
    server_name _;
    add_header X-Served-By "6983-web-02";
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hopescholar /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

#### 3. Load Balancer - Lb01 (`98.81.221.12`)
```bash
ssh -i $SSH_KEY ubuntu@98.81.221.12
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

**Load Balancer Nginx Configuration (`/etc/nginx/sites-available/gabrielmugisha.tech`):**
```nginx
# Upstream block for load balancing
upstream hopescholar_backend {
    server 54.227.215.118:80 weight=1;
    server 3.83.142.166:80 weight=1;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name gabrielmugisha.tech www.gabrielmugisha.tech;
    return 301 https://$server_name$request_uri;
}

# HTTPS server with load balancing
server {
    listen 443 ssl http2;
    server_name gabrielmugisha.tech www.gabrielmugisha.tech;
    
    # SSL certificates from Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/gabrielmugisha.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gabrielmugisha.tech/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to backend servers
    location / {
        proxy_pass http://hopescholar_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

**Install SSL Certificate:**
```bash
sudo certbot --nginx -d gabrielmugisha.tech -d www.gabrielmugisha.tech
sudo nginx -t && sudo systemctl reload nginx
```

#### 4. DNS Configuration
- A Record: `gabrielmugisha.tech` → `98.81.221.12` (Load Balancer IP)
- A Record: `www.gabrielmugisha.tech` → `98.81.221.12`

### Load Balancer Features
| Feature | Implementation |
|---------|---------------|
| **Algorithm** | Round-robin (equal weights) |
| **Backend Servers** | Web01 (54.227.215.118), Web02 (3.83.142.166) |
| **SSL** | Let's Encrypt with auto-renewal |
| **Security Headers** | HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| **Health Checks** | `/health` endpoint returns 200 OK |

### Verify Deployment
```bash
# Test Web01 directly
curl -I http://54.227.215.118/health
# Output: HTTP/1.1 200 OK, X-Served-By: 6983-web-01

# Test Web02 directly  
curl -I http://3.83.142.166/health
# Output: HTTP/1.1 200 OK, X-Served-By: 6983-web-02

# Test via load balancer (round-robin)
curl -s https://gabrielmugisha.tech/health
# Output: OK

# Verify SSL
curl -I https://gabrielmugisha.tech
# Output: HTTP/2 200, SSL verified
```

### Load Balancer Testing Results
```bash
# Multiple requests show traffic distribution
curl -s https://gabrielmugisha.tech/ | grep -i "served-by"
# Alternates between 6983-web-01 and 6983-web-02
```

### Alternative: Docker Deployment

```bash
# Build and run with Docker
docker build -t hopescholar .
docker run -d -p 8080:80 --name hopescholar hopescholar

# Or use Docker Compose (includes load balancer)
docker-compose up -d
```

### CI/CD (GitHub Actions)
Configure secrets in GitHub repository for automatic deployment:
- `WEB01_HOST`, `WEB01_USER`, `WEB01_SSH_KEY`
- `WEB02_HOST`, `WEB02_USER`, `WEB02_SSH_KEY`  
- `LB01_HOST`, `LB01_USER`, `LB01_SSH_KEY`

---

## Security

- `escapeHtml()` — all API content sanitised before DOM insertion
- `validateInput()` — user inputs sanitised before API calls
- No API keys — zero credential exposure risk
- HTTPS on load balancer via Let's Encrypt
- Security headers: HSTS, X-Frame-Options, X-Content-Type-Options

---

## Challenges Faced & Solutions

| Challenge | Solution Implemented |
|-----------|---------------------|
| **CORS Policy Blocking** | RSS feeds from external sources were blocked by browser CORS policies. Solved by using the **RSS2JSON proxy service** which converts RSS to JSON with proper CORS headers. |
| **API Rate Limiting** | The Hipolabs Universities API has rate limits. Implemented **client-side caching** in `cache.js` with 1-hour TTL to reduce API calls and improve performance. |
| **SSL Certificate Management** | Configuring HTTPS for multiple servers was complex. Solved by terminating SSL at the **load balancer** (Lb01) using Let's Encrypt, while Web01/Web02 use HTTP internally. |
| **Server Synchronization** | Keeping Web01 and Web02 in sync during deployment. Solved using **Docker containerization** and **GitHub Actions CI/CD pipeline** for automated, consistent deployments. |
| **IP Address vs Domain Access** | When accessing via IP address (`98.81.221.12`), SSL certificate validation failed because the cert is issued for `gabrielmugisha.tech`. This is expected behavior - **always use the domain name for HTTPS**. |

---

## Error Handling

### API Error Handling
```javascript
// From js/utils.js - fetchWithTimeout wrapper
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        // User sees: "Unable to load universities. Please try again later."
        showToast('error', 'Failed to load data. Using cached data if available.');
        throw error;
    }
}
```

### Implemented Error Handling Strategies

| Scenario | User Feedback | Implementation |
|----------|--------------|----------------|
| **Hipolabs API Down** | "Unable to load universities. Please try again later." | Try-catch with toast notification |
| **Network Timeout** | "Request timed out. Check your connection." | 10-second timeout in `fetchWithTimeout()` |
| **Invalid JSON Response** | "Data format error. Using fallback data." | JSON parse error handling with static fallback |
| **RSS Feed Unavailable** | Static scholarship opportunities still displayed | Dual data source: RSS + static JS data |
| **XSS Injection Attempt** | Sanitized display | `escapeHtml()` function sanitizes all API output |
| **Invalid User Input** | "Please enter a valid search term." | `validateInput()` strips special characters |

### Security Measures

```javascript
// XSS Protection - From js/utils.js
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Input validation
function validateInput(input) {
    // Remove potentially dangerous characters
    return input.replace(/[<>\"']/g, '').trim();
}
```

All API responses are sanitized before DOM insertion to prevent XSS attacks.

---

_African Leadership University · Web Infrastructure & APIs Assignment · 2025_
_Credit: Hipo Labs · REST Countries · RSS2JSON · Mastercard Foundation · Plus Jakarta Sans_

