# ================================
# DEVELOPMENT STAGE
# ================================
FROM node:20-slim AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["yarn", "start:dev"]


# ================================
# BUILD STAGE
# ================================
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# deps completas para build
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


# ================================
# PRODUCTION STAGE
# ================================
FROM node:20-slim AS production

WORKDIR /app

# signal handling correto
RUN apt-get update \
 && apt-get install -y dumb-init \
 && rm -rf /var/lib/apt/lists/*

# usuário não-root
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -m nodejs

COPY package.json yarn.lock ./

# somente deps de runtime
RUN yarn install --frozen-lockfile --production=true \
 && yarn cache clean

# apenas build final
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["dumb-init", "node", "dist/main.js"]
