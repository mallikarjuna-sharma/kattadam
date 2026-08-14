# Deploy Lambda (use AWS Cloud Shell)

## Quick deploy (recommended)

Open **AWS Cloud Shell** (ap-south-1), then:

```bash
export AWS_PAGER=""
rm -rf ~/kattadam-deploy
git clone --depth 1 https://github.com/mallikarjuna-sharma/kattadam.git ~/kattadam-deploy
cd ~/kattadam-deploy
bash infra/deploy-lambda-cloudshell.sh
```

If you already cloned:

```bash
cd ~/kattadam-deploy && git pull && bash infra/deploy-lambda-cloudshell.sh
```

Cloud Shell uses your **console login** credentials — not `KattadamSES-send`, not `aws configure` on your Mac.

---

## What failed on your Mac

| Command | Why it failed |
|---------|----------------|
| `npm run deploy` | `KattadamSES-send` lacked `lambda:UpdateFunctionCode` (you fixed this in IAM) |
| `bash infra/deploy-lambda-cloudshell.sh` | No AWS credentials on Mac — this script is **Cloud Shell only** |

---

## After IAM fix: Mac deploy (optional)

```bash
cd backend/lambda
cp .env.local.example .env.local   # add KATTADAM_AWS_* keys
npm run deploy
```

---

## GUI alternative

Lambda → **kattadam-api** → **Code** → upload zip built in Cloud Shell:

```bash
cd ~/kattadam-deploy/backend/lambda && npm run build && cd dist && zip function.zip index.mjs
```

Download `function.zip` from Cloud Shell → Lambda Console → **Upload from** → `.zip file`.
