#!/bin/bash

set -e

# check for necessary env vars
for required_env_var in \
  AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY \
  AWS_DEFAULT_REGION \
  AWS_REGION \
  GITHUB_REPOSITORY \
  GITHUB_REF ; do
  if [[ ! -n "${!required_env_var}" ]] ; then
    echo "env var ${required_env_var} must be set"
    exit 2
  fi
done

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


# browser test
if [[ "${SLOW}" == "y" ]]
then
  SLOW_ARG="--slow"
else
  SLOW_ARG=
fi
node Smoke.cjs \
  --site ${APP_URL} ${SLOW_ARG}