# Sun Wave Solar

Next.js (App Router) marketing site + lead-capture backend for a solar products company.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend / Database

The lead form (`src/components/forms/LeadForm.tsx`) posts to `POST /api/leads`
(`src/app/api/leads/route.ts`), which validates input with `zod`
(`src/lib/leadSchema.ts`) and writes a row via Prisma ORM
(`prisma/schema.prisma`, model `Lead`) to a MySQL database. No separate
backend service is needed - Next.js API routes handle it.

### Local development database

A local MySQL 8 database runs in Docker, isolated from anything else on this
machine:

```bash
# start it (already created; only needed after a reboot / stop)
docker start sunwave-mysql

# stop it
docker stop sunwave-mysql
```

Connection details (already in `.env`, gitignored):

```
DATABASE_URL="mysql://sunwave:sunwave_pw@127.0.0.1:3307/sun_wave"
```

Data persists in the Docker volume `sunwave_mysql_data` even if the container
is removed and recreated.

Useful commands:

```bash
npm run db:studio    # visual DB browser (Prisma Studio) - a free mini admin panel for leads
npm run db:migrate   # create/apply a new migration after editing prisma/schema.prisma
```

### Deploying to Hostinger (MySQL)

Hostinger's shared/business/VPS plans all provide MySQL databases you can use
as-is - no code changes needed, only the connection string:

1. In hPanel, go to **Databases -> MySQL Databases** and create a database +
   user (Hostinger gives you a host, port, database name, username, password).
2. On the server, set the `DATABASE_URL` env var to those values, e.g.:
   ```
   DATABASE_URL="mysql://u123456789_sunwave:YOUR_PASSWORD@localhost:3306/u123456789_sunwave"
   ```
   (see `.env.example`)
3. Run `npx prisma migrate deploy` (or `npm run db:deploy`) once to create the
   tables on that database.
4. `npm run build && npm run start` (Hostinger's Node.js hosting runs these
   the same way as any Node app; if you're on a plan without Node.js hosting,
   you'd need a VPS plan instead - shared hosting alone won't run a Next.js
   server).

That's the whole migration - same Prisma schema, same code, just a different
`DATABASE_URL`.
