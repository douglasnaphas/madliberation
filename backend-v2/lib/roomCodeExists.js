function roomCodeExists(awsSdk) {
  const middleware = (req, res, next) => {
    next();
  };
  return middleware;
}
module.exports = roomCodeExists;