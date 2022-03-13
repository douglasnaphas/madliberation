const flagAuthedRequests = () => {
  const middleware = (req, res, next) => {
    const logger = require("../logger");
    const responses = require("../responses");
    if (req.method === "POST") {
      if (!req.body) {
        return next();
      }
      if (!req.body.user && !req.body.email) {
        return next();
      }
      if (req.body.user) {
        res.locals.user = req.body.user;
      }
      if (req.body.email) {
        res.locals.preAuthEmail = decodeURIComponent(req.body.email);
      }
      return next();
    } else if (req.method === "GET") {
      if (!req.query) {
        return next();
      }
      if (!req.query.user && !req.query.email) {
        return next();
      }
      if (req.query.user) {
        res.locals.user = req.query.user;
      }
      if (req.query.email) {
        res.locals.preAuthEmail = decodeURIComponent(req.query.email);
      }
      return next();
    }
    logger.log({
      message: `flagAuthedRequests: non-POST, non-GET`,
      method: req.method,
    });
    return next();
  };
  return middleware;
};
module.exports = flagAuthedRequests;
// TODO: use req.{query,body}.email, as an alternative to user, to indicate
// authed requests.
