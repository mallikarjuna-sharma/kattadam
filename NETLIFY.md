# Deploy KATTADAM to Netlify (single site)

One Next.js app serves:

- **Customer** — `/`, `/materials`, …
- **Admin** — `/admin`, `/admin/users`, …

## Build

Root **`netlify.toml`** runs `npm run build` with `@netlify/plugin-nextjs`. No base-directory tricks.

## Environment variables (Netlify → Site settings → Environment variables)

| Variable | Notes |
|----------|--------|
| `KATTADAM_API_URL` | Lambda Function URL (no trailing slash), e.g. `https://xxx.lambda-url.ap-south-1.on.aws` |
| `KATTADAM_API_SECRET` | Optional — same value as on Lambda; protects admin routes |
| `OTP_HASH_SECRET` | Only if running OTP flows outside Lambda (normally not needed on Netlify) |

Add **`NODE_VERSION=20`** if the build image is older (already set in `netlify.toml` `[build.environment]`).

**Remove deprecated vars** if still present: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KATTADAM_AWS_*` (SES runs on Lambda).

## First-time setup

1. Put this project in a Git repo and push to GitHub/GitLab/Bitbucket (Netlify deploys from Git).
2. In [Netlify](https://app.netlify.com): **Add new site** → **Import an existing project** → pick the repo.
3. Leave **Base directory** empty. Build command **`npm run build`** and Node **20** are set by `netlify.toml`.
4. Under **Site configuration → Environment variables**, add `KATTADAM_API_URL` (Production + Deploy previews as needed).
5. **Deploy site**. Fix any build errors from the deploy log, then redeploy.

## Deploy new changes (after setup)

- **Git workflow:** Commit and push to the branch Netlify is watching (usually `main`). Netlify builds automatically.
- **Manual deploy:** Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**.
- **CLI (optional):** `npm i -g netlify-cli` → `netlify login` → in project root `netlify link` (once) → `netlify deploy --build --prod`.

No second site or monorepo base-directory overrides needed.

## Troubleshooting

### `publish directory cannot be the same as the base directory`

Netlify **Site settings → Build & deploy → Publish directory** must **not** be set to `.` or the repository root. This repo’s `netlify.toml` sets **`publish = ".next"`**, which overrides the UI when the file is deployed.

If you still see the error, open the build log **Resolved config**: if `publishOrigin` is `ui` and points at `/opt/build/repo`, clear **Publish directory** in the UI (delete the field), save, and redeploy so `netlify.toml` wins.

### API returns 503 on `/api/*`

`KATTADAM_API_URL` is missing or the site was not redeployed after adding it. Test Lambda directly: `curl -s "$KATTADAM_API_URL/health"`.
