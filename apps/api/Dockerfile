FROM oven/bun:1.3.13

WORKDIR /app

COPY package.json bun.lock tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/activity-sdk/package.json packages/activity-sdk/package.json
COPY packages/database/package.json packages/database/package.json

RUN bun install --frozen-lockfile

COPY apps/api apps/api
COPY packages/activity-sdk packages/activity-sdk
COPY packages/database packages/database

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=/data/vokara.sqlite

RUN mkdir -p /data

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["bun", "run", "start"]
