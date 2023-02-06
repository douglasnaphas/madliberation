/**
 * Return middleware satisfying:
 * pre: res.locals[paramsName] is set to a valid object for params to
 * aws-sdk.S3.getObject
 * post: awsSdk.S3.getObject is executed with the supplied params, and
 * res.locals.s3Data and res.locals.s3Error are populated with the data and
 * error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's S3.getObject and S3
 * constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this operation are stored
 * @return {Function} Express middleware that executes getObject and calls
 * next, or sends 500 if res.locals[paramsName] is not defined
 */
function runS3Get(awsSdk, paramsName) {
  const middleware = async (req, res, next) => {
    const responses = require("../responses");
    if (!res.locals[paramsName]) {
      console.log("runS3Get: res.locals.paramsName not set");
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const s3 = new awsSdk.S3();
    const s3Response = await new Promise((resolve, reject) => {
      s3.getObject(res.locals[paramsName], (err, data) => {
        resolve({ err: err, data: data });
      });
    });
    res.locals.s3Error = s3Response.err;
    res.locals.s3Data = s3Response.data;
    return next();
  };
  return middleware;
}
module.exports = runS3Get;
