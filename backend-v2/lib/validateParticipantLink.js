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
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
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
        res.locals.roomCode = req.query[api.URL_QUERY_PARAMS.ROOM_CODE];
        res.locals.pw = req.query[api.URL_QUERY_PARAMS.PW];
        res.locals.ph = req.query[api.URL_QUERY_PARAMS.PARTICIPANT_HASH];
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
        res.locals.roomCode = req.body[api.POST_BODY_PARAMS.ROOM_CODE];
        res.locals.pw = req.body[api.POST_BODY_PARAMS.PW];
        res.locals.ph = req.body[api.POST_BODY_PARAMS.PARTICIPANT_HASH];
        return next();
      }
    );
  }
  middleware.push(
    // get participant item from the db
    async (req, res, next) => {
      const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
      const ddbClient = new DynamoDBClient({ region });
      const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
      const queryParams = {
        TableName: schema.TABLE_NAME,
        KeyConditionExpression: `${schema.PARTITION_KEY} = :rc and begins_with(${schema.SORT_KEY}, :hp)`, // hash prefix
        ExpressionAttributeValues: {
          ":rc": res.locals.roomCode,
          ":hp": schema.PARTICIPANT_PREFIX + schema.SEPARATOR + res.locals.ph,
        },
      };
      try {
        const response = await ddbDocClient.send(new QueryCommand(queryParams));
        const items = response.Items;
        if (items.length > 1) {
          logger.log("validateParticipantLink: imprecise hash:");
          logger.log(res.locals.ph);
          return res.status(400).send({ err: "imprecise participant hash" });
        }
        const participant = items[0];
        res.locals.participant = participant;
        logger.log(`validateParticipantLink: saved participant`);
        return next();
      } catch (error) {
        logger.log(
          "validateParticipantLink: error getting item from db, error:"
        );
        logger.log(error);
        logger.log("validateParticipantLink: locals:")
        logger.log(res.locals);
        return res.status(500).send(responses.SERVER_ERROR);
      }
    },
    // check participant_pw
    (req, res, next) => {
      const { participant } = res.locals;
      if (
        participant[schema.PARTICIPANT_PW].find((pw) => pw === res.locals.pw)
      ) {
        logger.log(
          "validateParticipantLink: authenticated link for " +
            res.loals.roomCode +
            ", " +
            res.locals.ph
        );
        return next();
      }
      logger.log(
        "validateParticipantLink: bad link for " +
          res.locals.roomCode +
          ", " +
          res.locals.ph
      );
      return res.status(400).send({ err: "bad params" });
    }
  );
  return middleware;
}
module.exports = validateParticipateLink;
