#!/bin/bash

# get the bucket name from SSM param store
PARAM_NAME=$(npx @cdk-turnkey/stackname FrontendBucketName)
BUCKET=$(aws ssm get-parameter --name ${PARAM_NAME} | jq '.Parameter.Value')

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}
