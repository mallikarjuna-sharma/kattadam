# Kattadam Lambda API

Edit code in `src/` — deploy with one command (no manual zip).

## Local workflow

```bash
cd backend/lambda
npm install

# Edit src/routes/*.mjs, src/handler.mjs, etc.

npm run deploy
```

Requires AWS CLI credentials with `lambda:UpdateFunctionCode` (e.g. `KattadamSES-send` access keys in `~/.aws/credentials`).

Optional env:

```bash
export AWS_REGION=ap-south-1
export LAMBDA_FUNCTION_NAME=kattadam-api
export LAMBDA_FUNCTION_URL=https://lzp67olabvxlrfs4ni4xagmztu0gcunk.lambda-url.ap-south-1.on.aws
```

## Edit directly in AWS Console (no local deploy)

1. Lambda → **kattadam-api** → **Code**
2. Create/edit `index.mjs` in the inline editor
3. **Deploy** button in the console

Good for quick one-file tweaks. For multiple files, use `src/` + `npm run deploy` here.

## Function URL

`https://lzp67olabvxlrfs4ni4xagmztu0gcunk.lambda-url.ap-south-1.on.aws`

- `GET /health`
- `GET /catalog/materials`

## Layout

```
src/
  handler.mjs       # route table
  lib/http.mjs      # CORS, json helpers
  routes/           # one file per area
```

`npm run build` bundles to `dist/index.mjs` (esbuild). `npm run deploy` uploads automatically.
