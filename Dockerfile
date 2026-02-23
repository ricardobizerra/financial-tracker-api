FROM node:20-slim AS base

# Install OpenSSL for Prisma and procps for NestJS watch mode
RUN apt-get update -y && apt-get install -y openssl procps && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Stage: Dependencies
# Install all dependencies (including dev) for building
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage: Development
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn generate:dev
CMD ["yarn", "start:dev"]

# Stage: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn generate:prod
RUN yarn build

# Stage: Production
FROM base AS production
ENV NODE_ENV=production

# Create non-root user
RUN groupadd -r nodeapp && useradd -r -g nodeapp -d /app -s /usr/sbin/nologin nodeapp

COPY package.json yarn.lock ./

# Install ONLY production dependencies to keep the image small
RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn cache clean

# Copy necessary artifacts from builder
COPY --from=builder --chown=nodeapp:nodeapp /app/dist ./dist
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Switch to non-root user
USER nodeapp

CMD ["node", "dist/main"]
