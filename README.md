# Perantau Global Platform

Monorepo untuk perantauglobal.com + app.perantauglobal.com + admin CRM.

See [CLAUDE.md](./CLAUDE.md) untuk arsitektur lengkap.

## Quick start

```bash
pnpm install
cp .env.example .env.local  # fill in Supabase keys
pnpm dev
```

## Structure

- `apps/web` — perantauglobal.com (marketing)
- `apps/platform` — app.perantauglobal.com (candidate + admin)
- `packages/db` — Supabase client + types + migrations

## DTG public website

- The demand site uses language-first URLs: `/en`, `/id`, and `/ar`. Requests without a language prefix are redirected to the English equivalent.
- Use the language switch to retain the current page path. Article language options are enabled only when that translation is published.
- Article copy lives in `apps/demand/src/lib/article-content.ts`. Drafts remain out of the public article index, homepage, sitemap, and single-post routes until the locale record is approved and its `status` is changed to `published` with a `publishedAt` date.
- Article publishing is currently file-based: after BD and legal approval, update the record and deploy the site. There is no content-management screen.
- `packages/ui` — shared design system
- `packages/config` — shared tsconfig/eslint/tailwind

