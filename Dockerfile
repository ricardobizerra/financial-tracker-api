FROM node:20-slim AS base

# Install OpenSSL for Prisma and procps for NestJS watch mode
RUN apt-get update -y && apt-get install -y openssl procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Development stage
FROM base AS development
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn generate
CMD ["yarn", "start:dev"]
