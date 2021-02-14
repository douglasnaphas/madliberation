#!/usr/bin/env bash

STACKNAME=$(npx @cdk-turnkey/stackname@1.1.0 --suffix webapp)
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
cd frontend
REACT_APP_COGNITO_LINK="${IDP_URL}" npm run ci-build
