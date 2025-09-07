FROM node:21-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

ARG NEXT_CORE_API_URL
ENV NEXT_PUBLIC_CORE_API_URL=$NEXT_CORE_API_URL

ARG NEXT_QRCODE_API_URL
ENV NEXT_PUBLIC_QRCODE_API_URL=$NEXT_QRCODE_API_URL

ARG NEXT_SPACE_URL
ENV NEXT_PUBLIC_SPACE_URL=$NEXT_SPACE_URL

ARG NEXT_PUBLIC_BUILD_HASH
ENV NEXT_PUBLIC_BUILD_HASH=$NEXT_PUBLIC_BUILD_HASH

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY

ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

ARG NEXT_PUBLIC_QRCN_URL
ENV NEXT_PUBLIC_QRCN_URL=$NEXT_PUBLIC_QRCN_URL

WORKDIR /app

COPY . .

## Setup clients
WORKDIR /app/clients/coresvc
RUN yarn install

WORKDIR /app/clients/qrcodesvc
RUN yarn install

WORKDIR /app
RUN yarn install
RUN yarn build

# Step 2. Production image, copy all the files and run next
FROM base AS runner

ARG NEXT_CORE_API_URL
ENV NEXT_PUBLIC_CORE_API_URL=$NEXT_CORE_API_URL

ARG NEXT_QRCODE_API_URL
ENV NEXT_PUBLIC_QRCODE_API_URL=$NEXT_QRCODE_API_URL

ARG NEXT_SPACE_URL
ENV NEXT_PUBLIC_SPACE_URL=$NEXT_SPACE_URL

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Note: Don't expose ports here, Compose will handle that for us
CMD ["node", "server.js"]
