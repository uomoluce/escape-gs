# About

0gs.pw is built using Payload CMS and Next.js. 

## How it's built

This is a monorepo setup where Payload CMS and the Next.js frontend share the same codebase and deployment. The CMS runs at `/admin` and the frontend at the root, both served from the same Next.js instance.

- Frontend: `src/app/(frontend)` with route groups for collections and posts. Pages render via server components and media handled with Next Image.
- CMS: `src/app/(payload)` runs the Payload Admin.

## Data model

- `posts`: Blog entries for the Desk. Rich text via Lexical with restricted blocks:
  - Blocks: `MediaBlock`, `Embed`
  - Drafts + Preview + Scheduled publish enabled
- `pages`: Flexible page builder
  - Tabs: `Hero`, `Content (blocks: Content, MediaBlock, FormBlock)`, `SEO`
  - Drafts + Preview enabled
  - Hidden from the admin sidebar
- `discography`: Year, title, label, type, `url`, optional `audioUrl` (validated to audio file extensions)
- `mixes`, `events`, `curatorship`, `soundDesign`: custom collections for site sections
- `media`, `categories`, `users`
- Global: `Header`

## Editorial workflow

- Draft Preview + Live Preview for `posts` and `pages`
- Scheduled publish enabled via Payload jobs
- Search indexes `posts` only
- Redirects managed via plugin (UI hidden), used for safe URL changes

## Revalidation

- On change, the frontend is revalidated:
  - `posts`: `afterChange`/`afterDelete`
  - `pages`: `afterChange`/`afterDelete`
  - `header` global
  - redirects
- Note: when an image is edited (e.g., crops), republish the using page to refresh the Next Image cache.

## Tech stack

- Next.js App Router, React, TypeScript
- Payload CMS (Postgres)
- TailwindCSS + shadcn/ui
- Optional Vercel Blob storage in production for media

## Development

1. `pnpm install`
2. `pnpm dev` → http://localhost:3000

Env vars:
- `PAYLOAD_SECRET` (required)
- `DATABASE_URI` (Postgres)
- `CRON_SECRET` (for scheduled publish tasks; optional locally)
- `BLOB_READ_WRITE_TOKEN` (only if using Vercel Blob in prod)

Common scripts:
- `pnpm dev` — dev server
- `pnpm build && pnpm start` — production
- `pnpm payload migrate:create` — create migration
- `pnpm payload migrate` — run migrations

## Notes

- `pages` are hidden from the admin sidebar to simplify editorial surface area.
- Search currently targets `posts` only.

