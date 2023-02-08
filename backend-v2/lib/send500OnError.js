const logger = require("../logger");
const responses = require("../responses");
const send500OnError = (err, req, res, next) => {
  logger.log("send500OnError: caught error");
  logger.log(err);
  return res.status(500).send(responses.SERVER_ERROR);
}
module.exports = send500OnError;
