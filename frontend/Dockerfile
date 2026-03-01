# ================================
# DEVELOPMENT STAGE
# ================================
FROM node:20-slim AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]


# ================================
# DEPENDENCIES
# ================================
FROM node:20-slim AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ================================
# BUILD
# ================================
FROM node:20-slim AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ================================
# PRODUCTION
# ================================
FROM node:20-slim AS production

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
