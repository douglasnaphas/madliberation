function logSuccess(Logger) {
  const middleware = (req, res, next) => {
    Logger.log({roomCode: req.query.roomCode, status: 200, event:
      'poplated script retrieved'});
    next();
  };
  return middleware;
}
module.exports = logSuccess;