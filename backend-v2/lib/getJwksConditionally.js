const getJwksConditionally = (req, res, next) => {
  const axios = require("axios");
  const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
  if(!res.locals.user) return next();
  const middleware = getMadLnJwksFromAws(axios);
  return middleware(req, res, next);
};
module.exports = getJwksConditionally;