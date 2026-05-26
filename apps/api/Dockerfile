# ─────────────────────────────────────────────
# BUILD STAGE
# ─────────────────────────────────────────────


FROM oven/bun:1.3.13-slim AS build

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build


# ─────────────────────────────────────────────
# RUNTIME
# ─────────────────────────────────────────────


FROM node:22-slim AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm install -g bun

RUN bun install --omit=dev

RUN bun x playwright install --with-deps chromium

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main"]
