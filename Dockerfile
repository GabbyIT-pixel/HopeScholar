# ══════════════════════════════════════════════════════════════
# Dockerfile — HopeScholar (Bonus: Containerisation)
# Serves the static app using Nginx inside a Docker container.
# Build:  docker build -t hopescholar .
# Run:    docker run -p 8080:80 hopescholar
# Open:   http://localhost:8080
# ══════════════════════════════════════════════════════════════

FROM nginx:alpine

# Copy all project files into the Nginx web root
COPY . /usr/share/nginx/html

# Copy custom Nginx config for the container
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- http://localhost/health || exit 1
