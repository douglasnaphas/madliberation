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
    return next();
  }
}
module.exports = dbParamsGetEmailFromOpaqueCookie;