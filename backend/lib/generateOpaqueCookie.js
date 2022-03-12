/**
 * @return Express middleware satisfying:
 *   post: res.locals.opaqueCookie is a sequence of random capital letters
 * @param {Function*} randomCapGenerator A Generator that yields a series of
 *   capital letter strings, like randomCapGenerator.js.
 */
function generateOpaqueCookie({ randomCapGenerator }) {
  return (req, res, next) => {
    const OPAQUE_COOKIE_LENGTH = 30;
    res.locals.opaqueCookie = randomCapGenerator({
      letters: OPAQUE_COOKIE_LENGTH,
    }).next().value;
    return next();
  };
}
module.exports = generateOpaqueCookie;
