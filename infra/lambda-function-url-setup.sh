#!/usr/bin/env bash
# Run in AWS Cloud Shell (ap-south-1). Skips API Gateway — uses Lambda Function URL.
set -euo pipefail

export AWS_PAGER=""
export AWS_REGION=ap-south-1
export FUNCTION_NAME=kattadam-api

echo "==> Waiting for Lambda to become active..."
aws lambda wait function-active-v2 --function-name "$FUNCTION_NAME" --region "$AWS_REGION"

echo "==> Function state:"
aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --region "$AWS_REGION" \
  --query '{State:State,LastUpdateStatus:LastUpdateStatus,Memory:MemorySize,Arch:Architectures[0]}' \
  --output table

echo "==> Creating Function URL (public HTTPS, no API Gateway)..."
if aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$AWS_REGION" 2>/dev/null; then
  echo "Function URL already exists."
else
  aws lambda create-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --region "$AWS_REGION"
fi

echo "==> Allow public invoke via Function URL..."
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$AWS_REGION" 2>/dev/null || echo "(permission may already exist)"

FUNCTION_URL=$(aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$AWS_REGION" \
  --query 'FunctionUrl' --output text)

echo ""
echo "Lambda Function URL:"
echo "  $FUNCTION_URL"
echo ""
echo "Test health:"
echo "  curl -s \"${FUNCTION_URL}health\""
echo ""
echo "Netlify env:"
echo "  KATTADAM_API_URL=${FUNCTION_URL%/}"
