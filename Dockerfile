# ============================================================
# HopeScholar - Dockerfile
# Docker containerization for easy deployment
# ============================================================

# Use official nginx base image with Alpine Linux for small size
FROM nginx:alpine

# Labels
LABEL maintainer="Gabriel Mugisha <g.mugisha4@alustudent.com>"
LABEL description="HopeScholar - Connecting African students to fully funded education"
LABEL version="1.0.0"

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create custom nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml; \
    gzip_min_length 1000; \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 30d; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Health check endpoint \
    location /health { \
        access_log off; \
        return 200 "OK\n"; \
        add_header Content-Type text/plain; \
    } \
    \
    # Main app \
    location / { \
        try_files $uri $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/hopescholar.conf

# Copy application files to nginx document root
COPY index.html /usr/share/nginx/html/
COPY app.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
