/**
 * Return middleware satisfying:
 * pre: Game Name is in req.body[api.POST_BODY_PARAMS.GAME_NAME] or
 * req.query[api.URL_QUERY_PARAMS.GAME_NAME]
 * post: Game Name is in res.locals.gameName and next is called, 403 on missing
 * Game Name, Game Name in body given precedence over query, Game Name URI-
 * decoded if taken from the query
 */
function getGameName() {
  const api = require('../../api');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.body[api.POST_BODY_PARAMS.GAME_NAME] &&
      !req.query[api.URL_QUERY_PARAMS.GAME_NAME]) {
      return res.status(403).send(responses.FORBIDDEN);
    }
    if(req.body[api.POST_BODY_PARAMS.GAME_NAME] &&
      req.query[api.URL_QUERY_PARAMS.GAME_NAME] &&
      req.body[api.POST_BODY_PARAMS.GAME_NAME] !=
      decodeURI(req.query[api.URL_QUERY_PARAMS.GAME_NAME])) {
      return res.status(403).send(responses.FORBIDDEN);  
    }
    res.locals.gameName = req.body[api.POST_BODY_PARAMS.GAME_NAME] ||
      decodeURI(req.query[api.URL_QUERY_PARAMS.GAME_NAME]);
    return next();
  };
  return middleware;
}
module.exports = getGameName;