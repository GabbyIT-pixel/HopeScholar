# Dockerfile — HopeScholar (Bonus: Containerisation)
# docker build -t hopescholar . && docker run -p 8080:80 hopescholar
FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } location /health { return 200 "OK"; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost/health || exit 1
