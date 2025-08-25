FROM node:20 AS builder

WORKDIR /app

COPY frontend/package*.json .

RUN npm install

COPY frontend .

# Pass env vars into build
ARG VITE__RUN__SERVER_PORT
ARG VITE__MAIN_API_PREFIX
ARG VITE__SECONDARY_API_PREFIX
ARG VITE__GAME_THRESHOLD_HOURS
ARG VITE__DAILY_UPDATE_TIME_UTC
ARG VITE__CLEANUP_INTERVAL_DAYS

RUN npm run build

# -------------------------

FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${VITE__RUN__SERVER_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
