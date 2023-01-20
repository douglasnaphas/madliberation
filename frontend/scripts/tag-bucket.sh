BUCKET=$1
if [[ -z ${BUCKET }]]
then
  echo "BUCKET must be set, like bash tag-bucket.sh bucket-name"
  ARBITRARY_NONZERO_NUMBER=50
  exit ${ARBITRARY_NONZERO_NUMBER}
fi
new_tagset="[{\"Key\":\"SHA\",\"Value\":\"${GITHUB_SHA}\"}]"
if ! old_tagset=$(aws s3api get-bucket-tagging --bucket 2>/dev/null)
then
  true
else
  new_tagset=$(echo "${old_tagset}" | jq ".TagSet += [{\"Key\":\"SHA\",\"Value\":\"${GITHUB_SHA}\"}]")
fi
aws s3api put-bucket-tagging "${new_tagset}"