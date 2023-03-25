const checkQueryParams = require("../checkQueryParams");
const api = require("../../api");
const dbParams = require("./dbParams");
const runQuery = require("../runQuery");
const awsSdk = require("aws-sdk");
const handleQueryErrors = require("../handleQueryErrors");
const prepRes = require("./prepRes");
const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../../logger");
const schema = require("../../schema");
const responses = require("../../responses");

/**
 * pre:
 *   1) req.query.roomcode is set
 *   2) req.query.gamename is set
 * post:
 *   A response is sent like
 *     {
 *        assignments: [
 *          {id: '..', prompt: '..', example: '..', sentence: '..'},
 *          ...
 *        ]
 *     }
 */
const assignmentsMiddleware = [
  // check for query params
  checkQueryParams([
    "sederCode",
    api.URL_QUERY_PARAMS.ROOM_CODE,
    api.URL_QUERY_PARAMS.PW,
    api.URL_QUERY_PARAMS.PARTICIPANT_HASH,
  ]),
  // get participant item from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const queryParams = {
      TableName: schema.TABLE_NAME,
      KeyConditionExpression: `${schema.PARTITION_KEY} = :rc and begins_with(${schema.SORT_KEY}, :hp)`, // hash prefix
      ExpressionAttributeValues: {
        ":rc": req.query[api.URL_QUERY_PARAMS.ROOM_CODE],
        ":hp":
          schema.PARTICIPANT_PREFIX +
          schema.SEPARATOR +
          req.query[api.URL_QUERY_PARAMS.PARTICIPANT_HASH],
      },
    };
    try {
      const response = await ddbDocClient.send(new QueryCommand(queryParams));
      const items = response.Items;
      if (items.length > 1) {
        logger.log("assignmentsMiddleware: imprecise hash:");
        logger.log(req.query[api.URL_QUERY_PARAMS.PARTICIPANT_HASH]);
        return res.status(400).send({ err: "imprecise participant hash" });
      }
      const participant = items[0];
      res.locals.participant = participant;
      logger.log(`assignmentsMiddleware: saved participant:`);
      logger.log(res.locals.participant);
      return next();
    } catch (error) {
      logger.log("getPath: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check participant_pw
  (req, res, next) => {
    const { participant } = res.locals;
    if (
      participant[schema.PARTICIPANT_PW].find(
        (pw) => pw === req.query[api.URL_QUERY_PARAMS.PW]
      )
    ) {
      logger.log(
        "assignmentsMiddleware: authenticated link for " +
          req.query.sederCode +
          ", " +
          req.query[api.URL_QUERY_PARAMS.PARTICIPANT_HASH]
      );
      return next();
    }
    logger.log(
      "assignmentsMiddleware: bad link for " +
        req.query.sederCode +
        ", " +
        req.query[api.URL_QUERY_PARAMS.PARTICIPANT_HASH]
    );
    return res.status(400).send({ err: "bad params" });
  },
  // set db query params to get assignments
  dbParams(),
  // run db query
  runQuery(awsSdk, "assigmentsDbParams"),
  // handle db errors
  handleQueryErrors(),
  // prepare response, send only the prompt, example, and sentence
  prepRes(),
  // send
  (req, res) => {
    res.send(res.locals.assignments);
  },
];
module.exports = assignmentsMiddleware;
