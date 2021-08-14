const setJwtCookies = () => {
  const middleware = (req, res, next) => {
    ["id_token", "access_token", "refresh_token"].forEach(token => {
      const cookieOptions = { httpOnly: true };
      if (process.env.NODE_ENV !== "development") {
        cookieOptions.secure = true;
        console.log("setJwtCookies: setting same-site to strict");
        cookieOptions.sameSite = "strict";
      } else {
        console.log("setJwtCookies: setting same-site to None")
        cookieOptions.sameSite = "None";
      }
      res.cookie(token, res.locals[token], cookieOptions);
    });
    return next();
  };
  return middleware;
};
module.exports = setJwtCookies;
