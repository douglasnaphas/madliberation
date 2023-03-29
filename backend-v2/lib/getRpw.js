const checkQueryParams = require("./checkQueryParams");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const getPath = [
  // get rpw from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const getParams = {
      TableName: schema.TABLE_NAME,
      Key: {
        room_code: req.query.sederCode,
        lib_id: schema.READ_PW_PREFIX,
      },
    };
    try {
      const response = await ddbDocClient.send(new GetCommand(getParams));
      res.locals.seder = response.Item;
      logger.log(`getRpw: saved seder ${res.locals.participant.room_code}`);
      return next();
    } catch (error) {
      logger.log("getRpw: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // Return
  (req, res) => {
    return res.send({ rpw: res.locals.seder[schema.READ_PW] });
  },
];
module.exports = getPath;
