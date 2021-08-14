const flagAuthedRequests = () => {
  const middleware = (req, res, next) => {
    const logger = require("../logger");
    const responses = require("../responses");
    if(req.method === 'POST') {
      if(!req.body || !req.body.user) return next();
      if(typeof req.body.user !== 'string') {
        logger.log(`flagAuthedRequests: non-string sub`);
        return res.status(400).send(responses.BAD_REQUEST);
      }
      res.locals.user = req.body.user;
      return next();
    } else if(req.method === 'GET') {
      if(!req.query || !req.query.user) return next();
      if(typeof req.query.user !== 'string') {
        logger.log(`flagAuthedRequests: non-string sub`);
        return res.status(400).send(responses.BAD_REQUEST);
      }
      res.locals.user = req.query.user;
      return next();
    }
    logger.log(
      {
        message: `flagAuthedRequests: non-POST, non-GET`,
        method: req.method
      }
    );
    return next();
  };
  return middleware;
};
module.exports = flagAuthedRequests;
