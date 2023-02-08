/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals has string properties email and opaqueCookie (500 if missing)
 * post: res.locals['dbParamsPutLoginCookieInfo'] is set to an object that will
 *   work as params to DynamoDB's putItem, to:
 *   1) create an item (opaqueCookie) -> (email)
 */
function dbParamsPutLoginCookieInfo() {
  const schema = require("../schema");
  const Configs = require("../Configs");
  const responses = require("../responses");
  const middleware = (req, res, next) => {
    if (
      !res.locals.email ||
      !res.locals.opaqueCookie ||
      !res.locals.opaqueCookieExpirationDate ||
      !res.locals.opaqueCookieExpirationMs ||
      !res.locals.opaqueCookieIssuedDate ||
      !res.locals.opaqueCookieIssuedMs
    ) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.dbParamsPutLoginCookieInfo = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]: `${res.locals.opaqueCookie}`,
        [schema.SORT_KEY]: `${schema.OPAQUE_COOKIE}`,
        [schema.USER_EMAIL]: `${res.locals.email}`,
        [schema.OPAQUE_COOKIE_ISSUED_DATE]: `${res.locals.opaqueCookieIssuedDate}`,
        [schema.OPAQUE_COOKIE_ISSUED_MILLISECONDS]: `${res.locals.opaqueCookieIssuedMs}`,
        [schema.OPAQUE_COOKIE_EXPIRATION_DATE]: `${res.locals.opaqueCookieExpirationDate}`,
        [schema.OPAQUE_COOKIE_EXPIRATION_MILLISECONDS]: `${res.locals.opaqueCookieExpirationMs}`,
      },
    };
    return next();
  };
  return middleware;
}

module.exports = dbParamsPutLoginCookieInfo;
