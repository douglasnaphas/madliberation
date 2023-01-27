BUCKET=$1
if [[ -z ${BUCKET} ]]
then
  echo "BUCKET must be set, like bash tag-bucket.sh bucket-name"
  ARBITRARY_NONZERO_NUMBER=50
  exit ${ARBITRARY_NONZERO_NUMBER}
fi
new_tagset="[{\"Key\":\"SHA\",\"Value\":\"${GITHUB_SHA}\"}]"
if ! old_tagset=$(aws s3api get-bucket-tagging --bucket $BUCKET 2>/dev/null)
then
  true
else
  new_tagset=$(echo "${old_tagset}" | node -e 'const d = JSON.parse(require("fs").readFileSync(0, "utf-8")); const newTagSet = d.TagSet.map(e => {if(e.Key == "SHA") return {Key:"SHA",Value:"'${GITHUB_SHA}'"}; return e;}) ; console.log(JSON.stringify({TagSet: newTagSet}));')
fi
echo "new_tagset:"
echo "${new_tagset}"
aws s3api put-bucket-tagging --bucket ${BUCKET} --tagging "${new_tagset}"