const schema = require("../schema");
const logger = require("../logger");
/**
 * @return middleware satisfying:
 * pre:
 *   - res.locals.loginCookie is set
 * post:
 *   - res.locals.dbParamsGetEmailFromOpaqueCookie is set to an object that will
 *     work as params to DynamoDB's query to get the user's email address
 * @param {string} local If local is set and res.locals[local] is not, return
 * next() immediately
 */
function dbParamsGetEmailFromOpaqueCookie(local) {
  return (req, res, next) => {
    if (!res.locals[local]) {
      return next();
    }
    if (!res.locals.loginCookie) {
      logger.log(
        `res.locals[local] (${res.locals[local]}) is set, but not` +
          ` loginCookie`
      );
      return res.sendStatus(500);
    }
    res.locals.dbParamsGetEmailFromOpaqueCookie = {
      TableName: schema.TABLE_NAME,
      Key: {
        [schema.PARTITION_KEY]: res.locals.loginCookie,
      },
    };
    return next();
  };
}
module.exports = dbParamsGetEmailFromOpaqueCookie;
