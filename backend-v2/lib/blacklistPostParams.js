/**
 * Express middleware that sends 400 if:
 *   - req.body.roomCode exists and matches Configs.roomCodeBlacklist, or
 *   - req.body.gameName exists and matches Configs.gameNameBlacklsit, or
 *   - req.body.libAnswer exists and matches Configs.libAnswerBlacklist,
 * calls next otherwise.
 */
function blackListPostParams(req, res, next) {
  const Configs = require("../Configs");
  const responses = require("../responses");
  if (
    req.body.roomCode &&
    req.body.roomCode.match(Configs.roomCodeBlacklist())
  ) {
    console.log("bad post param(s)");
    console.log("req.body", req.body);
    return res.status(400).send(responses.BAD_REQUEST);
  }
  return next();
}
module.exports = blackListPostParams;
