# nextjs-prisma-docker-compose

Minimal Next.js + Prisma starter (created with create-next-app).

This repository can be developed either with a local Node/Yarn environment or using Docker Compose (recommended for an identical dev environment). The instructions below show both options.

## Prerequisites

- If using Docker Compose: Docker Desktop or Docker Engine with the Compose plugin.
- If not using Docker: Node 22+ and Yarn (project uses yarn@1.x).

## Quick start — recommended (Docker Compose)

1. Start app + Postgres with hot reload:

   ```bash
   docker compose up
   ```

2. Open the app: [http://localhost:3000](http://localhost:3000)  
   Postgres: localhost:5432 (user: postgres, password: postgres, db: postgres)

3. Common container commands:

   ```bash
   # Start in background
   docker compose up -d

   # Tail app logs
   docker compose logs -f app

   # Stop and remove containers
   docker compose down

   # Stop and remove volumes (clears node_modules/.next and DB data)
   docker compose down -v
   ```

## Local dev (no Docker)

1. Install deps:

   ```bash
   yarn install
   ```

2. Start dev server:

   ```bash
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Prisma

- Schema: `prisma/schema.prisma`
- Prisma helper: `src/lib/prisma.ts`

Useful Prisma commands (run in the app container or locally):

```bash
docker compose exec app yarn prisma generate
docker compose exec app yarn db:push
docker compose exec app yarn db:migrate
docker compose exec app yarn db:studio
```

or locally (if you have Node/Yarn installed):

```bash
yarn prisma generate
yarn db:push
yarn db:migrate
yarn db:studio
```

## Scripts

- `yarn dev` — development server
- `yarn build` — production build
- `yarn start` — start built app
- `yarn types` — TypeScript typecheck (tsc --noEmit)
- `yarn lint` — run ESLint
- `yarn db:push` / `db:migrate` / `db:studio` — Prisma commands

## Notes

- The Docker Compose workflow binds the project into the container and runs install/generate steps automatically, providing a consistent dev environment.
- You may choose to develop locally without Docker; Docker Compose is suggested if you want parity with the containerized environment.

## Troubleshooting

- If a port is in use, change the published port or stop the process using it.
- To clear caches and volumes prior to rebuild:

  ```bash
  docker compose down -v && docker compose up --build
  ```

## License

- GNU GENERAL PUBLIC LICENSE 2
