/**
 * return Middleware that sends 200 with
 *   {result: 'success',
 *    gameName: req.body.gameName,
 *    roomCode: req.body.roomCode},
 *  sends 500 otherwise.
 */
function succeed() {
  const Logger = require('../../lib/Logger');
  const middleware = (req, res) => {
    const responses = require('../../responses');
    if(!req.body || !req.body.roomCode || !req.body.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    console.log(`rxvgi ${req.body.gameName} joined ${req.body.roomCode}`);
    return res.send(responses.success({
      gameName: req.body.gameName,
      roomCode: req.body.roomCode
    }))
  };
  return middleware;
}

module.exports = succeed;