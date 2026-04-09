FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
RUN npm install

FROM base AS builder
COPY --from=deps /app/ ./
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PEERJS_HOST
ARG NEXT_PUBLIC_PEERJS_PORT=9000
ARG NEXT_PUBLIC_PEERJS_PATH=/peer
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PEERJS_HOST=$NEXT_PUBLIC_PEERJS_HOST
ENV NEXT_PUBLIC_PEERJS_PORT=$NEXT_PUBLIC_PEERJS_PORT
ENV NEXT_PUBLIC_PEERJS_PATH=$NEXT_PUBLIC_PEERJS_PATH
ENV NEXT_OUTPUT=standalone
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/web

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
