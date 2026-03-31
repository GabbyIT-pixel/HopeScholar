# Dockerfile

# ========== Development Stage =======
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./

# For static files, we don't need npm install
# But we include it for potential future Node.js features
RUN npm ci --silent || true

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npx", "serve", ".", "-l", "3000"]

# ============== Production Stage ==============
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy static files
COPY . .

# Create cache directory for nginx
RUN mkdir -p /var/cache/nginx/client_temp

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
