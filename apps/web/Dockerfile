FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS builder
RUN apk add --no-cache libc6-compat

# 1) Copy only lock + workspace + root manifest (stable)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2) Copy ONLY package.json files from workspaces (stable-ish)
# If you have many libs, this is still much better than copying full source
COPY libs/*/package.json ./libs/
COPY apps/web/package.json ./apps/web/

# 3) Fetch deps using a persistent build cache for pnpm store
ENV PNPM_STORE_DIR=/pnpm/store
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch

# 4) Now copy the full source (changes here won't invalidate fetch layer)
COPY libs ./libs
COPY apps/web ./apps/web
COPY tsconfig.base.json ./

# 5) Install offline using same pnpm store cache
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile

ARG NEXT_PUBLIC_BASE_PATH=/
ARG NEXT_PUBLIC_APP_API_URL
ARG NEXT_PUBLIC_APP_FRONT_URL
ARG NEXT_PUBLIC_APP_ADMIN_URL
ARG SERVER_APP_API_URL

ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_APP_API_URL=$NEXT_PUBLIC_APP_API_URL
ENV NEXT_PUBLIC_APP_FRONT_URL=$NEXT_PUBLIC_APP_FRONT_URL
ENV NEXT_PUBLIC_APP_ADMIN_URL=$NEXT_PUBLIC_APP_ADMIN_URL
ENV SERVER_APP_API_URL=$SERVER_APP_API_URL
ENV NEXT_PRIVATE_STANDALONE=true

RUN pnpm --filter ./apps/web build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder to where Next.js expects it
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Pass SERVER_APP_API_URL to runner env
ARG SERVER_APP_API_URL
ENV SERVER_APP_API_URL=$SERVER_APP_API_URL

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
