# Deployment runbook

## Required infrastructure

- Vercel project pinned to Node 22
- Managed PostgreSQL with TLS, automated backups and point-in-time recovery
- Microsoft Entra ID application restricted to the organisation tenant
- Separate databases and Entra redirect URIs for preview and production

## Environment variables

Configure every value in `.env.example`. Never reuse `AUTH_SECRET` as `WEBHOOK_SECRET`. Production secrets belong in Vercel environment settings, not source control.

`npm run env:check` runs automatically in the Vercel build and fails closed when required configuration is absent or malformed.

Entra redirect URI: `https://YOUR_DOMAIN/api/auth/callback/microsoft-entra-id`.

## First deployment

```bash
npm ci
npm run db:generate
npm run check
npm run db:deploy
```

Then deploy through Vercel. `vercel.json` uses `npm ci` and `npm run vercel-build`. Migrations are intentionally not executed inside the Vercel build because preview and production databases require controlled release sequencing.

Create the initial Admin/Director records with approved organisational email addresses through a controlled migration or one-off administration task. The included seed contains fictional data and is for disposable non-production databases only.

## Release gate

- `npm ci` and `npm run check` pass from a clean checkout.
- `npm run db:deploy` succeeds against the target database.
- Entra sign-in succeeds for an active user and fails for an unregistered or disabled user.
- A non-member receives no project data.
- A signed webhook is accepted and an invalid signature is rejected.
- Vercel WAF/rate-limiting rules protect `/api/auth/*` and `/api/webhooks`.
- Backups, restore testing, log retention and alert ownership are recorded.

## Rollback

Roll application code back through Vercel. Prisma migrations are forward-only; use a reviewed corrective migration rather than deleting production migration history. Restore the database only under the organisation's incident procedure.
