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

### Development (with HMR)

Run a single dev container with hot reload:

```bash
docker compose up
```

- App: http://localhost:3000
- Source is bind-mounted; edits on the host will hot-reload.
- File watching is enabled in containers via `WATCHPACK_POLLING=true` and `CHOKIDAR_USEPOLLING=1`.
- The container runs `yarn install` and `yarn dev -H 0.0.0.0` inside Node 22 Alpine.

Useful commands:

```bash
# Start in background
docker compose up -d

# Tail logs
docker compose logs -f app

# Stop containers
docker compose down

# Stop and remove volumes (clears node_modules/.next in the container)
docker compose down -v

# Rebuild after changing dependencies or Docker settings
docker compose up --build
```

Environment and volumes (from docker-compose.yml):

- Environment
  - `NODE_ENV=development`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `WATCHPACK_POLLING=true`, `CHOKIDAR_USEPOLLING=1` for reliable HMR in containers
- Volumes
  - `.:/app` bind mount for your source
  - Anonymous volumes for `/app/node_modules` and `/app/.next` so container installs don’t conflict with the host

If you hit dependency issues or want a clean slate:

```bash
docker compose down -v && docker compose up --build
```

### Production (no Compose)

Build and run the optimized image directly with the Dockerfile:

```bash
# Build the image
docker build -t nextjs-prisma-app:latest .

# Run the container on port 3000
docker run --rm -p 3000:3000 --name nextjs-prisma-web nextjs-prisma-app:latest

# (Optional) Run on a different port
docker run --rm -e PORT=8080 -p 8080:8080 --name nextjs-prisma-web nextjs-prisma-app:latest
```

The production image uses Next.js standalone output for a small runtime and starts with `node server.js`. `PORT` defaults to 3000.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

- Port already in use: change the published port (e.g., `-p 3001:3000` or edit `docker-compose.yml`).
- Stale dependencies or build cache: `docker compose down -v && docker compose up --build`.
- HMR not triggering: ensure you’re editing files under the bind-mounted directory and that polling env vars are set (they are by default in Compose).
- Permission issues on Linux: the dev container runs as root; production image runs as an unprivileged user (`nextjs`).

## Notes on Prisma / Database

This template doesn’t include a database or Prisma setup yet. If you add Prisma later, create a DB service in `docker-compose.yml` (e.g., Postgres), add `depends_on` for the app, and configure your `DATABASE_URL` environment variable. See Prisma’s docs for details: https://www.prisma.io/docs
