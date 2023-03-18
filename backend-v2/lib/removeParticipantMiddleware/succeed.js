/**
 * return Middleware that sends 200 with
 *   {result: 'success',
 *    gameName: req.body.gameName,
 *    sederCode: req.body.sederCode},
 *  sends 500 otherwise.
 */
function succeed() {
  const logger = require("../../logger");
  const middleware = (req, res) => {
    const responses = require("../../responses");
    if (!req.body || !req.body.sederCode || !req.body.gameName) {
      logger.log("v2/joinSederMiddleware/succeed: bad body, body:");
      logger.log(req.body);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    logger.log(
      `v2/joinSederMiddleware/succeed: ${req.body.gameName} joined ${req.body.roomCode}`
    );
    return res.send(
      responses.success({
        gameName: req.body.gameName,
        sederCode: req.body.sederCode,
      })
    );
  };
  return middleware;
}

module.exports = succeed;
