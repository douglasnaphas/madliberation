const Configs = require("../Configs");
/**
 * @return Middleware satisfying:
 *   pre: req.cookies[Configs.loginCookieName()] is set, has length
 *     Configs.OPAQUE_COOKIE_LENGTH(), and contains only capital letters.
 *   post: res.locals.loginCookie = req.cookies[Configs.loginCookieName()]
 *   Send 400 on error.
 * @param local {String} If res.locals[local] is absent, return next() and do
 *   nothing else
 */
function validateOpaqueCookie({ local }) {
  return (req, res, next) => {
    if (!res.locals[local]) {
      return next();
    }
    if (!req.cookies) {
      return res.status(400).send("no cookies");
    }
    if (!req.cookies[Configs.loginCookieName()]) {
      return res.status(400).send("no login cookie");
    }
    if (
      req.cookies[Configs.loginCookieName()].length !=
      Configs.OPAQUE_COOKIE_LENGTH()
    ) {
      return res.status(400).send("bad login cookie");
    }
    if (/[^A-Z]/.test(req.cookies[Configs.loginCookieName()])) {
      return res.status(400).send("bad login cookie");
    }
    res.locals.loginCookie = req.cookies[Configs.loginCookieName()];
    return next();
  };
}
module.exports = validateOpaqueCookie;
