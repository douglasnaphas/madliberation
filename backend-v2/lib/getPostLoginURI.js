const getPostLoginURI = () => {
  const middleware = (req, res, next) => {
    res.locals.postLoginURI = "/?";
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
