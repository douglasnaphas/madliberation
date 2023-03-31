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
echo "APP_URL:"
echo ${APP_URL}
echo ${USER_POOL_ID}
if [[ "${SLOW}" == "y" ]]
then
  SLOW_ARG="--slow"
else
  SLOW_ARG=
fi
node Links.itest.cjs \
  --site ${APP_URL} \
  ${SLOW_ARG}