const bucket = {
  Bucket: (path) => path.split("/")[0],
  path2key: (path) => path.split("/")[1] + ".json",
};
module.exports = bucket;
