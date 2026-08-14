# Kattadam Lambda API

Edit code in `src/` — deploy with one command (no manual zip).

## Deploy (recommended: AWS Cloud Shell)

Do **not** use `aws configure` on your Mac. In **AWS Cloud Shell**:

```bash
git clone --depth 1 https://github.com/mallikarjuna-sharma/kattadam.git ~/kattadam-deploy
cd ~/kattadam-deploy && bash infra/deploy-lambda-cloudshell.sh
```

See `infra/DEPLOY-LAMBDA.md` in the repo root.

## Local deploy (optional, after IAM `lambda:UpdateFunctionCode` on KattadamSES-send)

Lambda → **kattadam-api** → **Code** → edit → **Deploy** (no local credentials).

## Function URL

`https://lzp67olabvxlrfs4ni4xagmztu0gcunk.lambda-url.ap-south-1.on.aws`

- `GET /health`
- `GET /catalog/materials`

## Layout

```
src/
  handler.mjs
  router.mjs
  lib/
```

`npm run build` → `dist/index.mjs`. `npm run deploy` uploads via AWS SDK (no AWS CLI).
