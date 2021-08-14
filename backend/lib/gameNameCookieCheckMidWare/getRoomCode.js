/**
 * Return middleware satisfying:
 * pre: Room Code is in req.body[api.POST_BODY_PARAMS.ROOM_CODE] or
 * req.query[api.URL_QUERY_PARAMS.ROOM_CODE]
 * post: Room Code is in res.locals.roomCode and next is called, 403 on missing
 * Room Code, Room Code in body given precedence over query
 */
function getRoomCode() {
  const api = require('../../api');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.body[api.POST_BODY_PARAMS.ROOM_CODE] &&
      !req.query[api.URL_QUERY_PARAMS.ROOM_CODE]) {
      return res.status(403).send(responses.FORBIDDEN);
    }
    if(req.body[api.POST_BODY_PARAMS.ROOM_CODE] &&
      req.query[api.URL_QUERY_PARAMS.ROOM_CODE] &&
      req.body[api.POST_BODY_PARAMS.ROOM_CODE] !=
      req.query[api.URL_QUERY_PARAMS.ROOM_CODE]) {
      return res.status(403).send(responses.FORBIDDEN);
    }
    res.locals.roomCode = req.body[api.POST_BODY_PARAMS.ROOM_CODE] ||
      req.query[api.URL_QUERY_PARAMS.ROOM_CODE];
    return next();
  };
  return middleware;
}
module.exports = getRoomCode;