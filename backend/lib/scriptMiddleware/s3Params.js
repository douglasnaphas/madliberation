/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals.path is set a String
 *   2) res.locals.version is set to a String
 * post: res.locals['scriptS3Params'] is set to an object that will work as
 * params to S3's getObject, to retrieve:
 *   1) The script content at the specified version
 */
function s3Params() {
  const bucket = require("../../bucket");
  const responses = require("../../responses");
  const api = require("../../api");
  const middleware = (req, res, next) => {
    if (!res.locals.path || !res.locals.version) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const s3Params = {
      Bucket: bucket.Bucket(res.locals.path),
      Key: bucket.path2key(res.locals.path),
      ResponseContentType: "text/html; charset=utf-8",
      VersionId: res.locals.version,
    };
    res.locals.scriptS3Params = s3Params;
    next();
  };
  return middleware;
}
module.exports = s3Params;
