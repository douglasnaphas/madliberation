#!/bin/bash

# get the user pool id from the stack output
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp)
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name ${STACKNAME} | \
  jq \
  '.Stacks[0].Outputs | map(select(.OutputKey | test("^UserPoolId$")))[0] | .OutputValue' \
  | tr -d '"' \
)
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name ${STACKNAME} | \
  jq \
  '.Stacks[0].Outputs | map(select(.OutputKey | test("^UserPoolClientId$")))[0] | .OutputValue' | \
  tr -d '"' \
)
# saving client name for now, to make sure Actions doesn't reveal the secret
# while I figure out the commands
CLIENT_SECRET=$(aws cognito-idp describe-user-pool-client \
  --user-pool-id ${USER_POOL_ID} \
  --client-id ${USER_POOL_CLIENT_ID} | \
  jq '.UserPoolClient.ClientName' | \
  tr -d '"' \
)
CLIENT_SECRET_FILE=cognito-client-secret.txt
echo -n ${CLIENT_SECRET} > ${CLIENT_SECRET_FILE}
CLIENT_SECRET_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name ${STACKNAME} | \
  jq \
  '.Stacks[0].Outputs | map(select(.OutputKey | test("^ClientSecretBucketName$")))[0] | .OutputValue' \
  | tr -d '"' \
)
aws s3api put-object --bucket ${CLIENT_SECRET_BUCKET_NAME} --key "secret.txt" --body ${CLIENT_SECRET_FILE}
