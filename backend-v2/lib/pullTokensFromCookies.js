const pullTokensFromCookies = () => {
  const middleware = (req, res, next) => {
    const logger = require("../logger");
    if(!res.locals || !res.locals.user) {
      logger.log(`pullTokensFromCookies: no user, locals:`);
      logger.log(res.locals);
      return next();
    }
    if(!req.cookies.access_token) {
      logger.log(
        `pullTokensFromCookies: user with no access_token: ${res.locals.user}`
      );
      res.set("WWW-Authenticate", 'Bearer realm="https://passover.lol", ' + 
        'error="missing_token", error_description="no access_token"');
      return res.sendStatus(401);
    }
    res.locals.access_token = req.cookies.access_token;
    res.locals.refresh_token = req.cookies.refresh_token;
    return next();
  };
  return middleware;
};
module.exports = pullTokensFromCookies;