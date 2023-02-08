#!/bin/bash

set -e
if ! aws sts get-caller-identity &> /dev/null
then
  echo "aws sts get-caller-identity failed"
  echo "Are AWS credentials configured?"
  ARBITRARY_NONZERO_NUMBER=4
  exit $ARBITRARY_NONZERO_NUMBER
fi
if [[ ! -n "${AWS_REGION}" && ! -n "${AWS_DEFAULT_REGION}" ]]
then
  echo "Set either AWS_REGION or AWS_DEFAULT_REGION"
  ARBITRARY_NONZERO_NUMBER=5
  exit $ARBITRARY_NONZERO_NUMBER
fi
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp)
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "FrontendCreateHaggadahBucketName"))[0].OutputValue' | \
  tr -d \")

echo "BUCKET:"
echo "${BUCKET}"

npm run build

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}
