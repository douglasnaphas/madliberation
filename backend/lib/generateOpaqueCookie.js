const Configs = require("../Configs");
/**
 * @return Express middleware satisfying:
 *   post:
 *     - res.locals.opaqueCookie is a sequence of random capital letters
 *     - res.locals.opaqueCookieIssuedDate is a string representing a date
 *     - res.locals.opaqueCookieIssuedMs is the corresponding ms
 *     - res.locals.opaqueCookieExpirationDate is a string representing a date
 *     - res.locals.opaqueCookieExpirationMs is the corresponding ms
 *     - res.locals.opaqueCookieExpirationMs exceeds res.locals.opaqueCookieIssuedMs
 *         by the expiration duration from Configs
 * @param {Function*} randomCapGenerator A Generator that yields a series of
 *   capital letter strings, like randomCapGenerator.js.
 */
function generateOpaqueCookie({ randomCapGenerator }) {
  return (req, res, next) => {
    res.locals.opaqueCookie = randomCapGenerator({
      letters: Configs.OPAQUE_COOKIE_LENGTH(),
    }).next().value;
    const opaqueCookieIssuedDate = new Date();
    res.locals.opaqueCookieIssuedDate = opaqueCookieIssuedDate.toISOString();
    res.locals.opaqueCookieIssuedMs = opaqueCookieIssuedDate.getTime();
    res.locals.opaqueCookieExpirationDate = Configs.loginCookieExpirationDate(
      opaqueCookieIssuedDate
    ).toISOString();
    res.locals.opaqueCookieExpirationMs = Configs.loginCookieExpirationDate(
      opaqueCookieIssuedDate
    ).getTime();
    return next();
  };
}
module.exports = generateOpaqueCookie;
