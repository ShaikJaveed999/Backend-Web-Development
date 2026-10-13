# Database Integration

This assignment replaces the in-memory repository layer with a PostgreSQL-backed Prisma implementation while preserving the existing API contract.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally or in a container
- A database named `community_dev` (or an equivalent value in `DATABASE_URL`)

## Install and configure

```bash
npm install
cp .env.example .env
```

Update `.env` to match your local PostgreSQL instance:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/community_dev?schema=public"
PORT=3000
```

Never commit `.env` or real credentials. `.env.example` is the only safe template.

## Prisma workflow

```bash
npm run prisma:format
npm run prisma:validate
npx prisma generate
npx prisma migrate dev --name init_database_integration
```

If PostgreSQL is not running yet, create the database first and then rerun the migration command.

## Seed the database

```bash
npm run seed
```

This script is idempotent and creates the starter user and post records without duplicating names.

## Run the API

```bash
npm start
```

## Run tests

```bash
npm test
```

## Reset the database safely

```bash
npx prisma migrate reset
```

Use this only on a local development database and only when you confirm the database is not shared or production data.
