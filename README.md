# Financial Tracker API

NestJS GraphQL API for Financial Tracker.

## Stack

- NestJS 10 with Apollo GraphQL.
- Prisma 5 and PostgreSQL.
- Redis for cache, subscriptions, and BullMQ queues.
- BullMQ and Resend for password reset email jobs.
- Scheduled jobs for card billing, transaction status, investment recalculation, and financial reference-data caches.

## Setup

```bash
cp .env.example .env
docker compose up -d postgres redis
docker compose run --rm api yarn migration:dev
docker compose up --build api
```

The API listens on `PORT` or `3333`.

## Common Commands

```bash
docker compose up --build api
docker compose run --rm api yarn build
docker compose run --rm api yarn test
docker compose run --rm api yarn test:e2e
docker compose run --rm api yarn migration:dev
docker compose run --rm api yarn generate:dev
docker compose run --rm api yarn seed:institutions
```

## Important Files

- `src/app.module.ts` - application module graph.
- `src/env.ts` - required environment schema.
- `src/main.ts` - runtime bootstrap, CORS, cookies, logging.
- `prisma/schema.prisma` - database source of truth.
- `src/lib/graphql/schema.gql` - generated GraphQL schema.
- `src/lib/graphql/prisma-client` - generated Prisma Nest GraphQL classes.

Do not hand-edit generated GraphQL files. See [repository docs](../docs/README.md) for architecture, commands, environment, operations, and workflows.
