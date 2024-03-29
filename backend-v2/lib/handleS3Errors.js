/**
 * Return middleware satisfying:
 * pre: res.locals.s3Error and res.locals.s3Data are populated with the results
 * from querying the database
 * post: if s3Error is truthy, send 500; call next otherwise
 * @return {Function} Express middleware that sends 500 on query error, calls
 * next otherwise
 */
const logger = require("../logger");
function handleS3Errors() {
  const middleware = (req, res, next) => {
    const responses = require("../responses");
    if (res.locals.s3Error || !res.locals.s3Data) {
      logger.log("handleS3Errors: s3Error or no data, locals:");
      logger.log(res.locals);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    return next();
  };
  return middleware;
}
module.exports = handleS3Errors;
