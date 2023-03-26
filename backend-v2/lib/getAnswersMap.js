const checkQueryParams = require("./checkQueryParams");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const getPath = [
  // check for required params
  checkQueryParams(["sederCode", "pw", "ph"]),
  // get participant item from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const queryParams = {
      TableName: schema.TABLE_NAME,
      KeyConditionExpression: `${schema.PARTITION_KEY} = :rc and begins_with(${schema.SORT_KEY}, :hp)`, // hash prefix
      ExpressionAttributeValues: {
        ":rc": req.body[api.POST_BODY_PARAMS.SEDER_CODE],
        ":hp":
          schema.PARTICIPANT_PREFIX +
          schema.SEPARATOR +
          req.body[api.POST_BODY_PARAMS.PARTICIPANT_HASH],
      },
    };
    try {
      const response = await ddbDocClient.send(new QueryCommand(queryParams));
      const items = response.Items;
      if (items.length > 1) {
        logger.log("getAnswersMap: imprecise hash:");
        logger.log(req.body[api.POST_BODY_PARAMS.PARTICIPANT_HASH]);
        return res.status(400).send({ err: "imprecise participant hash" });
      }
      const participant = items[0];
      res.locals.participant = participant;
      return next();
    } catch (error) {
      logger.log("getAnswersMap: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check participant_pw
  (req, res, next) => {
    const { participant } = res.locals;
    if (
      participant[schema.PARTICIPANT_PW].find(
        (pw) => pw === req.body[api.POST_BODY_PARAMS.PW]
      )
    ) {
      logger.log(
        "getAnswersMap: authenticated link for " +
          req.body.sederCode +
          ", " +
          req.body[api.POST_BODY_PARAMS.PARTICIPANT_HASH]
      );
      return next();
    }
    logger.log(
      "getAnswersMap: bad link for " +
        req.body.sederCode +
        ", " +
        req.body[api.POST_BODY_PARAMS.PARTICIPANT_HASH]
    );
    return res.status(400).send({ err: "bad params" });
  },
  // return answers map
  (req, res, next) => {
    return res.send(res.locals.participant[schema.ANSWERS_MAP]);
  },
];
module.exports = getPath;
