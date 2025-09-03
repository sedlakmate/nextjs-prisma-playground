This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker

Prerequisites:

- Docker Desktop or Docker Engine with Compose plugin
- No local Node/Yarn required for Compose dev; dependencies install inside the container

### Development (with HMR + Postgres)

Run the app and database with hot reload:

```bash
docker compose up
```

- App: http://localhost:3000
- Postgres: localhost:5432 (user: postgres, password: postgres, db: postgres)
- Source is bind-mounted; edits on the host will hot-reload.
- File watching is enabled via `WATCHPACK_POLLING=true` and `CHOKIDAR_USEPOLLING=1`.
- The app container runs `yarn install`, `npx prisma generate`, and `yarn dev -H 0.0.0.0`.

Quick test: visit `http://localhost:3000/api/users` to see an empty list by default (`{"users": []}`).

First-time schema (if you add models in `prisma/schema.prisma`):

```bash
docker compose exec app yarn db:push
```

Useful commands:

```bash
# Start in background
docker compose up -d

# Tail logs
docker compose logs -f app

# Stop containers
docker compose down

# Stop and remove volumes (clears node_modules/.next and db data)
docker compose down -v

# Rebuild after changing dependencies or Docker settings
docker compose up --build

# Open a psql shell
docker compose exec -T db psql -U postgres -d postgres -c "\dt"
```

Environment and volumes (from docker-compose.yml):

- Environment
  - `NODE_ENV=development`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `WATCHPACK_POLLING=true`, `CHOKIDAR_USEPOLLING=1`
  - `DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres?schema=public`
- Volumes
  - `.:/app` bind mount for your source
  - Anonymous volumes for `/app/node_modules` and `/app/.next`
  - Named volume `db-data` for Postgres persistence

### Prisma

Common commands (run inside the app container):

```bash
# Generate Prisma Client (runs automatically on install)
docker compose exec app yarn prisma generate

# Push schema to the DB (development)
docker compose exec app yarn db:push

# Create a migration (development)
docker compose exec app yarn db:migrate

# Open Prisma Studio (note: may require exposing port 5555)
docker compose exec app yarn db:studio
```

Schema location: `prisma/schema.prisma`.
Prisma Client helper: `src/lib/prisma.ts`.

### Production (Dockerfile)

Build and run the optimized image:

```bash
# Build the image
docker build -t nextjs-prisma-app:latest .

# Run with a production database URL
docker run --rm \
  -e DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public" \
  -e PORT=3000 -p 3000:3000 \
  --name nextjs-prisma-web \
  nextjs-prisma-app:latest
```

Notes:
- The image uses Next.js standalone output and includes Prisma engines.
- `DATABASE_URL` must point to your production database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

- Port already in use: change the published port (e.g., `-p 3001:3000`) or adjust `docker-compose.yml`.
- Stale dependencies or build cache: `docker compose down -v && docker compose up --build`.
- HMR not triggering: ensure you’re editing files under the bind-mounted directory.
- DB connection errors: confirm `db` is healthy (`docker compose ps`), and `DATABASE_URL` points to `db:5432` in Compose or a reachable host in production.
- Permission issues on Linux: dev container runs as root; production image runs as unprivileged user (`nextjs`).
