#!/bin/bash

set -e

# get the bucket name from SSM param store
PARAM_NAME=$(npx @cdk-turnkey/stackname --suffix FrontendBucketName)
BUCKET=$(aws ssm get-parameter --name ${PARAM_NAME} | jq '.Parameter.Value' | tr -d '"')

echo "PARAM_NAME:"
echo "${PARAM_NAME}"
echo "BUCKET:"
echo "${BUCKET}"

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}
