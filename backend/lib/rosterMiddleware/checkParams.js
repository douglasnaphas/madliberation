/**
 * Return middleware that sends 400 with "bad request" if roomcode is not
 * supplied as a URL query param.
 */
function checkParams() {
  const api = require('../../api');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.query[api.ROSTER.PARAMS.ROOM_CODE]) {
         return res.status(400).send(responses.BAD_REQUEST);
       }
    return next();  
  };
  return middleware;
}
module.exports = checkParams;