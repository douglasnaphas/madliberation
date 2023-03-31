/*
  send back:
    - participant_pw
    - lib_id, so they have the participant hash
*/
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const checkQueryParams = require("./checkQueryParams");
const getParticipantLinkData = [
  // if no res.locals.userEmail, 400
  (req, res, next) => {
    if (!res.locals.userEmail) {
      logger.log(
        `getParticipantLinkData: no userEmail, means auth is required but didn't happen, locals:`
      );
      logger.log(res.locals);
      return res.sendStatus(400);
    }
    return next();
  },
  // make sure an email (not a userEmail) was provided
  (req, res, next) => {
    checkQueryParams(["email"]);
  },
  // query the PARTICIPANT_EMAIL index for this email
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const queryParams = {
      TableName: schema.TABLE_NAME,
      IndexName: schema.PARTICIPANT_EMAIL_INDEX,
      KeyConditionExpression: "#e = :e",
      ExpressionAttributeNames: { "#e": schema.EMAIL },
      ExpressionAttributeValues: { ":e": req.query.email },
      ProjectionExpression:
        `${schema.PARTITION_KEY}, ${schema.SORT_KEY}, ` +
        `${schema.EMAIL}, ${schema.PARTICIPANT_PW}`,
    };
    try {
      const response = await ddbDocClient.send(new QueryCommand(queryParams));
      res.locals.items = response.Items;
      logger.log(`getParticipantLinkData: saved items for ${req.query.email}`);
      return next();
    } catch (error) {
      logger.log("getParticipantLinkData: error querying db, error, locals:");
      logger.log(error);
      logger.log(res.locals);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  (req, res, next) => {
    return res.send(res.locals.items);
  },
];
module.exports = getParticipantLinkData;
