#!/bin/bash

STACKNAME=$(npx @cdk-turnkey/stackname@1.1.0 --suffix webapp)
URL=https://$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "DomainName"))[0].OutputValue' | \
  tr -d \")
API_CANARY_URL=${URL}/prod/public-endpoint
CANARY_OUTPUT=$(curl ${API_CANARY_URL} | jq '.Output')
if [[ "${CANARY_OUTPUT}" != "\"this endpoint is public\"" ]]
then
  echo "expected output from ${API_CANARY_URL} to be \"this endpoint is public\""
  echo "got:"
  echo "${CANARY_OUTPUT}"
  echo "failing"
  exit 1
fi
npx ../itest --site ${URL}