const Configs = require("../Configs");
const setLoginCookie = () => {
  const middleware = (req, res, next) => {
    if (!res.locals.opaqueCookie || !res.locals.opaqueCookieExpirationMs) {
      return res.status(500).send("problem generating login cookie");
    }
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(res.locals.opaqueCookieExpirationMs),
    };
    res.cookie(
      Configs.loginCookieName(),
      res.locals.opaqueCookie,
      cookieOptions
    );
    return next();
  };
  return middleware;
};
module.exports = setLoginCookie;
