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
  MAKE_NEW_TAGSET='
  const d = JSON.parse(require("fs").readFileSync(0, "utf-8"));
  const newTagMap = {
    ...d.TagSet.reduce((acc, curr) => {
      return {...acc, [`${curr.Key}`]: curr.Value};
    }, {}),
    SHA: "'${GITHUB_SHA}'"
  };
  const newTagSet = Object.keys(newTagMap).map(
    k => {
      return {
        "Key": k,
        "Value": newTagMap[k]
      };
    }
  );
  console.log(JSON.stringify({TagSet: newTagSet}));
  '
  new_tagset=$(echo "${old_tagset}" | node -e "${MAKE_NEW_TAGSET}")
fi
echo "new_tagset:"
echo "${new_tagset}"
aws s3api put-bucket-tagging --bucket ${BUCKET} --tagging "${new_tagset}"
