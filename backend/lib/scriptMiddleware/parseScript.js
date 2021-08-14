/**
 * pre:
 *   1) res.locals.s3Data contains the results from fetching the script
 * post:
 *   1) res.locals.script contains the script parsed as a JS object, unmodified
 * 500 on error.
 */
function parseScript() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.s3Data) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const buf = new Buffer(res.locals.s3Data.Body);
    res.locals.script = JSON.parse(buf.toString('utf8'));
    return next();
  };
  return middleware;
}
module.exports = parseScript;