const checkQueryParams = require("./checkQueryParams");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const getLeaderEmail = [
  // check for required params
  checkQueryParams(["sederCode", "pw"]),
  // save pwHash
  (req, res, next) => {
    const crypto = require("crypto");
    const pwHash = crypto
      .createHash("sha256")
      .update(req.query.pw)
      .digest("hex")
      .toLowerCase();
    res.locals.pwHash = pwHash;
    return next();
  },
  // get correctPwHash and leaderEmail from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const getParams = {
      TableName: schema.TABLE_NAME,
      Key: {
        room_code: req.query.sederCode,
        lib_id: schema.SEDER_PREFIX,
      },
    };
    try {
      const response = await ddbDocClient.send(new GetCommand(getParams));
      res.locals.correctPwHash = response.Item.pwHash;
      logger.log(
        `getLeaderEmail: saved correctPwHash starting ${res.locals.correctPwHash.substring(
          0,
          3
        )}`
      );
      res.locals.leaderEmail = response.Item.leaderEmail;
      logger.log(`getLeaderEmail: saved leaderEmail ${res.locals.leaderEmail}`);
      return next();
    } catch (error) {
      logger.log("getLeaderEmail: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check pwHash, return or reject
  (req, res) => {
    if (res.locals.pwHash !== res.locals.correctPwHash) {
      logger.log(
        `getLeaderEmail: wrong hash ${res.locals.pwHash.substring(
          0,
          3
        )}... !== ${res.locals.correctPwHash.substring(0, 3)}...`
      );
      return res.status(400).send(responses.BAD_REQUEST);
    }
    return res.send({ leaderEmail: res.locals.leaderEmail });
  },
];
module.exports = getLeaderEmail;
