/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals has string properties nickname, email, sub, and
 *     cognito:username (500 if missing)
 * post: res.locals['dbParamsSaveUserTokenInfo'] is set to an object that will
 *   work as params to DynamoDB's transactWrite, to:
 *   1) create an item (sub, cognito:username) -> (nickname, email)
 */
function dbParamsSaveUserTokenInfo() {
  const schema = require('../schema');
  const responses = require('../responses');
  const api = require('../api');
  const DbSchema = require('../DbSchema');
  const middleware = (req, res, next) => {
    if(!res.locals.nickname || !res.locals.email || !res.locals.sub ||
      !res.locals["cognito:username"]) {
      return res.status(500).send(responses.SERVER_ERROR);  
    }
    res.locals.dbParamsSaveUserTokenInfo = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]: schema.PKEY_PREFIX_SUB + schema.SEPARATOR +
          res.locals.sub,
        [schema.SORT_KEY]: schema.USERINFO_PREFIX + schema.SEPARATOR +
          res.locals["cognito:username"],
        [schema.USER_NICKNAME]: res.locals.nickname,
        [schema.USER_EMAIL]: res.locals.email
      }
    }
    return next();
  };
  return middleware;
}

module.exports = dbParamsSaveUserTokenInfo;