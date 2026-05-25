# ─────────────────────────────────────────────
# BUILD STAGE
# ─────────────────────────────────────────────


FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ─────────────────────────────────────────────
# RUNTIME
# ─────────────────────────────────────────────


FROM node:22-slim AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

RUN npx playwright install --with-deps chromium

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main"]
