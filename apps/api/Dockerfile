# syntax=docker/dockerfile:1.7

# Base stage
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

# -----------------------------
# 1) Copy ONLY manifests first
# -----------------------------
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy ONLY workspace package manifests (NOT full source)
COPY libs/*/package.json ./libs/
COPY apps/api/package.json ./apps/api/

# Copy tsconfig (needed for build resolution)
COPY tsconfig.base.json ./

# If you have shared workspace configs that affect install/build, copy them here too (optional)
# COPY tools ./tools
# COPY eslint-config ./eslint-config

# -----------------------------
# 2) Cache pnpm store + fetch
# -----------------------------
ENV PNPM_STORE_DIR=/pnpm/store
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch

# -----------------------------
# 3) Now copy full source
# -----------------------------
COPY libs ./libs
COPY apps/api ./apps/api

# -----------------------------
# 4) Offline install using cached store
# -----------------------------
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --filter "./libs/*"

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --filter "./apps/api..."

# Build API
RUN pnpm --filter ./apps/api build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run with root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Fix ownership
RUN chown nestjs:nodejs /app

USER nestjs

# Copy package files
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy node_modules (same as your original)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy workspace libs
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs

# Copy entire API app (includes src, dist, tsconfig, etc.)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api ./apps/api

# Copy tsconfig base
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.base.json ./tsconfig.base.json

# Copy startup script
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/start.sh ./start.sh

USER root
RUN chmod +x ./start.sh
USER nestjs

EXPOSE 3333
