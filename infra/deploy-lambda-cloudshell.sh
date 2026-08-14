#!/usr/bin/env bash
# Run in AWS Cloud Shell after git clone (or upload backend/lambda folder).
set -euo pipefail
export AWS_PAGER=""
export AWS_REGION=ap-south-1
export FUNCTION_NAME=kattadam-api

cd "$(dirname "$0")/../backend/lambda"

npm install
npm run build

cd dist
zip -q function.zip index.mjs

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://function.zip \
  --region "$AWS_REGION"

aws lambda wait function-updated-v2 --function-name "$FUNCTION_NAME" --region "$AWS_REGION"

echo "Deployed. Test:"
echo "  curl -s https://lzp67olabvxlrfs4ni4xagmztu0gcunk.lambda-url.ap-south-1.on.aws/health"
echo ""
echo "Set OTP_HASH_SECRET on Lambda (same value as Netlify if you use one):"
echo "  aws lambda update-function-configuration --function-name $FUNCTION_NAME --region $AWS_REGION \\"
echo "    --environment Variables={TABLE_NAME=kattadam-main,SES_REGION=ap-south-1,SES_FROM_EMAIL=noreply@kattadam.in,OTP_HASH_SECRET=YOUR_SECRET}"
