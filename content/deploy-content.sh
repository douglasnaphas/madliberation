#!/bin/bash
set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.1.0 --suffix webapp)
TABLE_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "TableName"))[0].OutputValue' | \
  tr -d \")
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "ScriptsBucketName"))[0].OutputValue' | \
  tr -d \")
CONTENT_FILE_PATH='./content.json'
./bin/content2dynamo.js \
  --table-name ${TABLE_NAME} \
  --bucket-name ${BUCKET_NAME} \
  --content-file-path ${CONTENT_FILE_PATH}
echo $?
mkdir -p deploy
for f in scripts/*
do
  g=$(echo ${f} | sed 's/^scripts/deploy/' | sed 's/[.]md$/.json/')
  ./bin/txt2json.js ${f} > ${g}
done
aws s3 sync \
  --content-type "application/json" \
  --delete \
  deploy/ \
  s3://${BUCKET_NAME}
