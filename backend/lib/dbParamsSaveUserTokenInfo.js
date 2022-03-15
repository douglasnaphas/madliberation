/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals has string properties nickname, email, sub,
 *     cognito:username, and opaqueCookie (500 if missing)
 * post: res.locals['dbParamsSaveUserTokenInfo'] is set to an object that will
 *   work as params to DynamoDB's transactWrite, to:
 *   1) create an item (sub, cognito:username) -> (nickname, email, opaqueCookie)
 */
function dbParamsSaveUserTokenInfo() {
  const schema = require("../schema");
  const Configs = require("../Configs");
  const responses = require("../responses");
  const middleware = (req, res, next) => {
    if (
      !res.locals.nickname ||
      !res.locals.email ||
      !res.locals.sub ||
      !res.locals["cognito:username"] ||
      !res.locals.opaqueCookie
    ) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const opaqueCookieIssuedDate = new Date();
    const opaqueCookieIssuedMs = opaqueCookieIssuedDate.getTime();
    const opaqueCookieExpirationDate = Configs.loginCookieExpirationDate(
      opaqueCookieIssuedDate
    );
    const opaqueCookieExpirationMs = opaqueCookieExpirationDate.getTime();
    res.locals.dbParamsSaveUserTokenInfo = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]:
          schema.PKEY_PREFIX_SUB + schema.SEPARATOR + res.locals.sub,
        [schema.SORT_KEY]:
          schema.USERINFO_PREFIX +
          schema.SEPARATOR +
          res.locals["cognito:username"],
        [schema.USER_NICKNAME]: res.locals.nickname,
        [schema.USER_EMAIL]: res.locals.email,
        [schema.OPAQUE_COOKIE]: res.locals.opaqueCookie,
      },
    };
    return next();
  };
  return middleware;
}

module.exports = dbParamsSaveUserTokenInfo;
