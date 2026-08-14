#!/usr/bin/env bash
# Deploy kattadam-api Lambda — run ONLY in AWS Cloud Shell (not on your Mac).
# Cloud Shell already has AWS credentials from your console login.
set -euo pipefail

export AWS_PAGER=""
export AWS_REGION=ap-south-1
export FUNCTION_NAME=kattadam-api
export FUNCTION_URL="https://lzp67olabvxlrfs4ni4xagmztu0gcunk.lambda-url.ap-south-1.on.aws"

if ! aws sts get-caller-identity --region "$AWS_REGION" >/dev/null 2>&1; then
  echo "ERROR: No AWS credentials."
  echo "Run this script in AWS Cloud Shell (console.aws.amazon.com → Cloud Shell icon)."
  echo "Do not run on your Mac — use: cd backend/lambda && npm run deploy (with .env.local)."
  exit 1
fi

echo "Deploying as: $(aws sts get-caller-identity --query Arn --output text)"
echo ""

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend/lambda"

echo "==> npm install + build"
npm install --no-audit --no-fund
npm run build

echo "==> zip + upload"
rm -f dist/function.zip
(cd dist && zip -q function.zip index.js)

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://dist/function.zip \
  --region "$AWS_REGION"

echo "==> waiting for update..."
aws lambda wait function-updated-v2 --function-name "$FUNCTION_NAME" --region "$AWS_REGION"

echo ""
echo "Deployed successfully."
echo "  curl -s ${FUNCTION_URL}/health"
curl -s "${FUNCTION_URL}/health" || true
echo ""
echo ""
echo "Optional — set OTP_HASH_SECRET on Lambda (same as Netlify):"
echo "  aws lambda update-function-configuration --function-name $FUNCTION_NAME --region $AWS_REGION \\"
echo "    --environment Variables={TABLE_NAME=kattadam-main,SES_REGION=ap-south-1,SES_FROM_EMAIL=noreply@kattadam.in,OTP_HASH_SECRET=YOUR_SECRET}"
