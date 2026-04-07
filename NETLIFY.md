# Deploy KATTADAM to Netlify (single site)

One Next.js app serves:

- **Customer** — `/`, `/materials`, …
- **Admin** — `/admin`, `/admin/users`, …

## Build

Root **`netlify.toml`** runs `npm run build` with `@netlify/plugin-nextjs`. No base-directory tricks.

## Environment variables (Netlify → Site settings → Environment variables)

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional |

Add **`NODE_VERSION=20`** if the build image is older (already set in `netlify.toml` `[build.environment]`).

## Steps

1. Connect the repo on Netlify.
2. Confirm build command is `npm run build` (from `netlify.toml`).
3. Add the env vars above.
4. Deploy.

No second site or monorepo install overrides needed.
