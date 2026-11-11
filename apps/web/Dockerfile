FROM oven/bun:1.3.13 AS build

WORKDIR /app

COPY package.json bun.lock tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/activity-sdk/package.json packages/activity-sdk/package.json
COPY packages/database/package.json packages/database/package.json

RUN bun install --frozen-lockfile

COPY apps/web apps/web
COPY packages/activity-sdk packages/activity-sdk

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN bun --cwd apps/web build

FROM nginx:1.29-alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
