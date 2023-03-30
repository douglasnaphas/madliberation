const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const getSederSummary = [
  // query for participant info
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const queryParams = {
      TableName: schema.TABLE_NAME,
      KeyConditionExpression: "#pk = :rc and begins_with(#sk, :pp)",
      ExpressionAttributeNames: {
        "#pk": schema.PARTITION_KEY,
        "#sk": schema.SORT_KEY,
      },
      ExpressionAttributeValues: {
        ":rc": res.locals.roomCode,
        ":pp": schema.PARTICIPANT_PREFIX + schema.SEPARATOR,
      },
      ProjectionExpression: `${schema.GAME_NAME}, ${schema.ASSIGNMENTS}, ${schema.ANSWERS_MAP}`,
    };
    try {
      const response = await ddbDocClient.send(new QueryCommand(queryParams));
      res.locals.items = response.Items;
      logger.log(`getSederSummary: saved items for ${res.locals.roomCode}`);
      return next();
    } catch (error) {
      logger.log("getSederSummary: error querying db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  (req, res, next) => {
    if (!Array.isArray(res.locals.items)) {
      logger.log("getSederSummary: non-array items", res.locals.roomCode);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.participants = res.locals.items.map((participant) => {
      const gameName = participant[schema.GAME_NAME];
      const numberOfAssignments =
        participant[schema.ASSIGNMENTS] &&
        Array.isArray(participant[schema.ASSIGNMENTS])
          ? participant[schema.ASSIGNMENTS].length
          : 0;
      const numberOfAnswers = participant[schema.ANSWERS_MAP]
        ? Object.keys(participant[schema.ANSWERS_MAP]).length
        : 0;
      return {
        gameName,
        numberOfAssignments,
        numberOfAnswers,
      };
    });
    return next();
  },
  (req, res, next) => {
    return res.send({ participants: res.locals.participants });
  },
];
module.exports = getSederSummary;
