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
COPY apps/admin/package.json ./apps/admin/

# Copy tsconfig (if needed for install/build resolution)
COPY tsconfig.base.json ./

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
COPY apps/admin ./apps/admin

# -----------------------------
# 4) Offline install using cached store
# -----------------------------
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --filter "./libs/*"

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --filter "./apps/admin..."

ARG VITE_API_URL
ARG VITE_FRONT_URL
ARG VITE_ADMIN_URL
ARG VITE_APP_VERSION

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FRONT_URL=$VITE_FRONT_URL
ENV VITE_ADMIN_URL=$VITE_ADMIN_URL
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build admin app
RUN pnpm --filter ./apps/admin build

# Runner stage (Nginx)
FROM nginx:alpine AS runner
COPY --from=builder /app/dist/apps/admin /usr/share/nginx/html

# Copy nginx config from builder
COPY --from=builder /app/apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
