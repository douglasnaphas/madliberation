#!/bin/bash

set -e

STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp)
APP_URL=https://$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "webappDomainName"))[0].OutputValue' | \
  tr -d \")

# Backend smoke test
BACKEND_CANARY_URL=${APP_URL}/prod/public-endpoint
CANARY_OUTPUT=$(curl ${BACKEND_CANARY_URL} | jq '.Output')
if [[ "${CANARY_OUTPUT}" != "\"this endpoint is public\"" ]]
then
  echo "expected output from ${BACKEND_CANARY_URL} to be \"this endpoint is public\""
  echo "got:"
  echo "${CANARY_OUTPUT}"
  echo "failing"
  exit 1
fi
# www smoke test
WWW_APP_URL=https://$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "wwwDomainName"))[0].OutputValue' | \
  tr -d \")
if [[ "${WWW_APP_URL}" != "https://no www domain name" ]]
then
  WWW_BACKEND_CANARY_URL=${WWW_APP_URL}/prod/public-endpoint
  WWW_OUTPUT=$(curl ${WWW_BACKEND_CANARY_URL} | jq '.Output')
  if [[ "${WWW_OUTPUT}" != "\"this endpoint is public\"" ]]
  then
    echo "expected output from ${WWW_BACKEND_CANARY_URL} to be \"this endpoint is public\""
    echo "got:"
    echo "${WWW_OUTPUT}"
    echo "failing"
    exit 1
  fi
fi

# End-to-end test
# Figure out the Cognito hosted UI URL
# This has some info for constructing the URL:
# https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-domain.html
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "UserPoolClientId"))[0].OutputValue' | \
  tr -d \")
USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "UserPoolId"))[0].OutputValue' | \
  tr -d \")
USER_POOL_DOMAIN=$(aws cognito-idp describe-user-pool \
  --user-pool-id ${USER_POOL_ID} | \
  jq '.UserPool.Domain' | \
  tr -d \")
REDIRECT_URI=${APP_URL}/prod/get-cookies
IDP_URL="https://${USER_POOL_DOMAIN}.auth.${AWS_DEFAULT_REGION}.amazoncognito.com/login?response_type=code&client_id=${USER_POOL_CLIENT_ID}&redirect_uri=${REDIRECT_URI}"
echo "APP_URL:"
echo ${APP_URL}
echo "IDP_URL:"
echo ${IDP_URL}
echo "USER_POOL_ID:"
echo ${USER_POOL_ID}
npx ../itest \
  --site ${APP_URL} \
  --idp-url "${IDP_URL}" \
  --user-pool-id ${USER_POOL_ID}
pwd
ls