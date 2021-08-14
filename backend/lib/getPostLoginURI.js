const getPostLoginURI = (process) => {
  const middleware = (req, res, next) => {
    res.locals.postLoginURI = "/?";
    if (
      process &&
      process.env &&
      process.env.NODE_ENV &&
      process.env.NODE_ENV === "development" &&
      typeof req.protocol === "string" &&
      typeof req.get === "function" &&
      typeof req.get("host") === "string" &&
      (req.protocol === "https" || req.protocol === "http")
    ) {
      let port, host;
      const portMatch = req.get("host").match(/(.*):([0-9]{1,5})$/);
      const defaultFrontEndPort = 4400;
      if (!portMatch) {
        host = req.get("host");
        port = defaultFrontEndPort;
      } else {
        host = portMatch[1];
        port = portMatch[2] - 1 > 0 ? portMatch[2] - 1 : defaultFrontEndPort;
      }
      if (host === "api-dev.passover.lol") {
        res.locals.postLoginURI = `http://localhost:4400?`;
      } else {
        res.locals.postLoginURI = `${req.protocol}://${host}:${port}?`;
      }
    }
    res.locals.postLoginURI =
      res.locals.postLoginURI +
      `nickname=${encodeURIComponent(
        res.locals.nickname
      )}&email=${encodeURIComponent(res.locals.email)}` +
      "#/logging-in";
    return next();
  };
  return middleware;
};
module.exports = getPostLoginURI;
