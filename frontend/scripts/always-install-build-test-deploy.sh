#!/bin/bash

set -e

STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp)
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "FrontendBucketName"))[0].OutputValue' | \
  tr -d \")

echo "BUCKET:"
echo "${BUCKET}"

# install, build, test, deploy
npm install
npm run build
npm test

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}