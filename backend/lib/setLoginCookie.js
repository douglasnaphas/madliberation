const Configs = require("../Configs");
const setLoginCookie = () => {
  const middleware = (req, res, next) => {
    if (!res.locals.opaqueCookie) {
      return res.status(500).send("problem generating login cookie");
    }
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
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
