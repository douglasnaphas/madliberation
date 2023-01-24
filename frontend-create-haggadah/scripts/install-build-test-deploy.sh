#!/bin/bash

set -e

STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp)
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "FrontendCreateHaggadahBucketName"))[0].OutputValue' | \
  tr -d \")

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
if ! git diff --name-only ${bucket_sha} @ | grep '^frontend-create-haggadah/' > /dev/null
then
  echo "no changes to frontend-create-haggadah from ${bucket_sha} to ${GITHUB_SHA}"
  echo "not going any further with frontend-create-haggadah this build"
  exit 0
fi

# install, build, test, deploy
npm install
npm run build
npm test

source scripts/deploy-to-bucket.sh
deploy-to-bucket ${BUCKET}

bash scripts/tag-bucket.sh ${BUCKET}
