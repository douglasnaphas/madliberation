#!/bin/bash

BUCKET=$(cat cdk.json | jq '.context.frontendBucketName' | tr -d '"')
source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}
  