#!/bin/bash

set -e

# get the bucket name from SSM param store
# we would like to be able to do this only if the bucket is unknown, so that
# we can save a round trip when deploying from a dev computer
PARAM_NAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix FrontendBucketName)
BUCKET=$(aws ssm get-parameter --name ${PARAM_NAME} | jq '.Parameter.Value' | tr -d '"')

echo "PARAM_NAME:"
echo "${PARAM_NAME}"
echo "BUCKET:"
echo "${BUCKET}"

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}
