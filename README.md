# MEP Enterprise Platform

Deployment-ready application foundation for consultancy project control. Version 3 replaces the demonstration security stubs with Microsoft Entra ID authentication, PostgreSQL persistence, project-scoped access, transactional audit events, validated server workflows, schema-allowlisted client reports, authenticated webhooks and one protected `/platform` application surface.

## Runtime

- Next.js App Router, React and TypeScript
- Microsoft Entra ID OpenID Connect with authorization-code flow, PKCE and signed server sessions
- Prisma with PostgreSQL in local, preview and production environments
- Zod validation at input and report boundaries
- Vercel deployment configuration and security headers

## Local setup

1. Provision a PostgreSQL database and copy `.env.example` to `.env`.
2. Register a Microsoft Entra application. Add `http://localhost:3000/api/auth/callback/microsoft-entra-id` as a local redirect URI.
3. Replace the seed email addresses with approved Entra account emails before seeding.
4. Run:

```bash
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run check
npm run dev
```

Authentication is deny-by-default: an Entra identity must match an active `User.email` record.

## Quality gate

`npm run check` generates Prisma Client, type-checks, lints, runs structural smoke checks and security tests, then creates a production build. Database migration and seed verification require a configured PostgreSQL instance and are deliberately separate from the build.

## Deployment

Follow `DEPLOYMENT.md`. Apply migrations with `npm run db:deploy` before routing production traffic. Do not seed production with demonstration records.

See `VERIFICATION.md` for the packaging audit and the clean-CI release gate.
