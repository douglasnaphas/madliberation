const Configs = require("../Configs");
/**
 * @return Express middleware satisfying:
 *   post: res.locals.opaqueCookie is a sequence of random capital letters
 * @param {Function*} randomCapGenerator A Generator that yields a series of
 *   capital letter strings, like randomCapGenerator.js.
 */
function generateOpaqueCookie({ randomCapGenerator }) {
  return (req, res, next) => {
    res.locals.opaqueCookie = randomCapGenerator({
      letters: Configs.OPAQUE_COOKIE_LENGTH(),
    }).next().value;
    return next();
  };
}
module.exports = generateOpaqueCookie;
