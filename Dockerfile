FROM node:20-slim AS base

# Install OpenSSL for Prisma and procps for NestJS watch mode
RUN apt-get update -y && apt-get install -y openssl procps && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r nodeapp && useradd -r -g nodeapp -d /app -s /usr/sbin/nologin nodeapp

# Set working directory to /app to match docker-compose volume
WORKDIR /app

# Development stage
FROM base AS development
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn generate
CMD ["yarn", "start:dev"]

# Production stage
FROM base AS production
COPY package.json yarn.lock ./
# Install dependencies as root
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn generate:prod
RUN yarn build
# Ensure application files are owned by the non-root user
RUN chown -R nodeapp:nodeapp /app
# Run the application as the non-root user
USER nodeapp
CMD ["yarn", "start:prod"]
