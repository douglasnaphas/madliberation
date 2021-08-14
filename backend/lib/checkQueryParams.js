/**
 * @return {Function} Express middleware that sends 400 if any query params
 * listed in paramNames are unset, calls next otherwise
 * @param {Array} paramNames List of properties that should be set in
 * req.query
 */
function checkQueryParams(paramNames) {
  const responses = require("../responses");
  const middleware = (req, res, next) => {
    if (!paramNames) return next();
    if (!Array.isArray(paramNames)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if (paramNames.length < 1) return next();
    paramNames.forEach(paramName => {
      if (!req.query[paramName]) {
        return res.status(400).send(responses.BAD_REQUEST);
      }
    });
    return next();
  };
  return middleware;
}

module.exports = checkQueryParams;
