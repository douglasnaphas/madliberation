/**
 * @param props Object with:
 *   - method: "GET" or "POST". We can't read from req, because we don't have
 *     req yet when we're deciding which middleware to include in the series.
 * @returns middleware satisfying:
 * pre:
 *   - roomcode (or roomCode for POSTs), pw, and ph are set in body
 *     or query params, precise names based on api.js. If later middlewares want
 *     sederCode, they will have to enforce that themselves.
 * post:
 *   - 400 is returned on bad link
 *   - on good link:
 *     - sederCode/roomcode + ph look up one unique participant
 *     - pw is a valid participant_pw for the participant
 *     - params are saved in locals: roomCode, pw, ph
 *     - res.locals.participant is set to the participant from the db
 *   - 500 on error
 */
const checkQueryParams = require("./checkQueryParams");
const checkBody = require("./checkBody");
const api = require("../api");
function validateParticipateLink(props) {
  const { method } = props;
  const middleware = [];
  if (method === "GET") {
    middleware.push(
      checkQueryParams([
        api.URL_QUERY_PARAMS.ROOM_CODE,
        api.URL_QUERY_PARAMS.PW,
        api.URL_QUERY_PARAMS.PARTICIPANT_HASH,
      ]),
      (req, res, next) => {
        res.locals.roomCode = api.URL_QUERY_PARAMS.ROOM_CODE;
        res.locals.pw = api.URL_QUERY_PARAMS.PW;
        res.locals.ph = api.URL_QUERY_PARAMS.PARTICIPANT_HASH;
        return next();
      }
    );
  }
  if (method === "POST") {
    middleware.push(
      checkBody([
        api.POST_BODY_PARAMS.ROOM_CODE,
        api.POST_BODY_PARAMS.PW,
        api.POST_BODY_PARAMS.PARTICIPANT_HASH,
      ]),
      (req, res, next) => {
        res.locals.roomCode = api.POST_BODY_PARAMS.ROOM_CODE;
        res.locals.pw = api.POST_BODY_PARAMS.PW;
        res.locals.ph = api.POST_BODY_PARAMS.PARTICIPANT_HASH;
        return next();
      }
    );
  }
  middleware
    .push
    // get participant item from the db
    // check participant pw
    ();
  return middleware;
}
module.exports = validateParticipateLink;
