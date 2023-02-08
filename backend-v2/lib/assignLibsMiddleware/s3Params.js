/**
 * Return middleware satisfying:
 * pre: req.body.path is set a String
 * post: res.locals['assignLibsS3Params'] is set to an object that will work as
 * params to S3's getObject, retrieve:
 *   1) The script content,
 *   2) The current script version
 */
function s3Params() {
  const bucket = require("../../bucket");
  const responses = require("../../responses");
  const api = require("../../api");
  const middleware = (req, res, next) => {
    if (!req.body[api.POST_BODY_PARAMS.PATH]) {
      return res.status(400).send(responses.BAD_REQUEST);
    }
    const s3Params = {
      Bucket: bucket.Bucket(req.body[api.POST_BODY_PARAMS.PATH]),
      Key: bucket.path2key(req.body[api.POST_BODY_PARAMS.PATH]),
      ResponseContentType: "text/html; charset=utf-8",
    };
    res.locals.assignLibsS3Params = s3Params;
    next();
  };
  return middleware;
}
module.exports = s3Params;
