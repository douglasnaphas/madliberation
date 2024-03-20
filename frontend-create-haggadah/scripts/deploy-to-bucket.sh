#!/bin/bash

deploy-to-bucket() {
  BUCKET=$1
  if [[ ! -n "${BUCKET}" ]]
  then
    echo "error, deploy-to-bucket: bad bucket name ${BUCKET}"
    exit 1
  fi
  if ! aws s3 ls "s3://${BUCKET}" &> /dev/null
  then
    echo "error, deploy-to-bucket: unable to ls on s3://${BUCKET}"
    exit 1
  fi
  mkdir tmp-out
  mv out tmp-out/create-haggadah
  mv tmp-out out
  aws s3 sync --content-type "text/html" --exclude "*" --include "*.html" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "text/css" --exclude "*" --include "*.css" --include "*.css.map" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "application/json" --exclude "*" --include "*.json" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "image/x-icon" --exclude "*" --include "*.ico" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "image/svg+xml" --exclude "*" --include "*.svg" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "image/png" --exclude "*" --include "*.png" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "image/jpeg" --exclude "*" --include "*.jpg" --delete out/ s3://${BUCKET}/
  aws s3 sync --content-type "text/javascript" --exclude "*" --include "*.js" --include "*.js.map" --delete out/ s3://${BUCKET}/
}
  
