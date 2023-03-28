/**
 * pre:
 *   - req.query has sederCode and rpw
 * post:
 *   - 400 if rpw is not the rpw for this seder, next() otherwise
 */
const checkQueryParams = require("./checkQueryParams");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const validateReadLink = [
  // check for required params
  checkQueryParams(["sederCode", "rpw"]),
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
      res.locals.correctRpw = response.Item.rpw;
      logger.log(
        `validateReadLink: saved correct rpw for ${req.query.sederCode}`
      );
      return next();
    } catch (error) {
      logger.log("validateReadLink: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check rpw, reject or next
  (req, res, next) => {
    if (res.locals.correctRpw !== req.query.rpw) {
      logger.log(`validatReadLink: wrong rpw for ${req.query.sederCode}`);
      return res.status(400).send(responses.BAD_REQUEST);
    }
    return next();
  },
];
module.exports = validateReadLink;
