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

git log -1

# get bucket SHA tag
get-bucket-sha-tag() {
  aws s3api get-bucket-tagging --bucket $BUCKET 2>/dev/null | node -e 'const d = JSON.parse(require("fs").readFileSync(0, "utf-8")); if(!d || !d.TagSet || !d.TagSet.forEach){process.exit(0);} d.TagSet.forEach(t => {if(t.Key == "SHA"){console.log(t.Value);process.exit(0);}})'
}
bucket_sha=$(get-bucket-sha-tag)
echo ${bucket_sha}
# do SHA check, exit if no change
git diff --name-only ${bucket_sha}..@
# if [[ ]]
# install, build, test, deploy
npm install
npm run build
npm test

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}

bash scripts/tag-bucket.sh ${BUCKET}
