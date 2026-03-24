# Dockerfile — HopeScholar (Bonus: Containerisation)
# docker build -t hopescholar .
# docker run -p 8080:80 hopescholar
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/health || exit 1
