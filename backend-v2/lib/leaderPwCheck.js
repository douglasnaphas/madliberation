const responses = require("../responses");
const crypto = require("crypto");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const leaderPwCheck = [
  (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }
    if (req.query && req.query.sederCode && req.query.pw) {
      res.locals.sederCode = req.query.sederCode;
      res.locals.roomCode = req.query.sederCode;
      res.locals.pw = req.query.pw;
      return next();
    }
    return res.status(400).send({ err: "need sederCode and pw query params" });
  },
  (req, res, next) => {
    if (!["POST", "DELETE", "PUT", "PATCH"].includes(req.method)) {
      return next();
    }
    if (req.body && req.body.sederCode && req.body.pw) {
      res.locals.sederCode = req.body.sederCode;
      res.locals.roomCode = req.query.sederCode;
      res.locals.pw = req.body.pw;
      return next();
    }
    return res.status(400).send({ err: "need sederCode and pw params" });
  },
  // compute the pwHash
  (req, res, next) => {
    const pwHash = crypto
      .createHash("sha256")
      .update(res.locals.pw)
      .digest("hex")
      .toLowerCase();
    res.locals.pwHash = pwHash;
    return next();
  },
  // get the correct pwHash from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const getParams = {
      TableName: schema.TABLE_NAME,
      Key: {
        room_code: res.locals.sederCode,
        lib_id: schema.SEDER_PREFIX,
      },
    };
    try {
      const response = await ddbDocClient.send(new GetCommand(getParams));
      res.locals.correctPwHash = response.Item.pwHash;
      logger.log(
        `leaderPwCheck: saved correctPwHash starting ${res.locals.correctPwHash.substring(
          0,
          3
        )}`
      );
      res.locals.path = response.Item.path;
      logger.log(`leaderPwCheck: saved path ${res.locals.path}`);
      return next();
    } catch (error) {
      logger.log("leaderPwCheck: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // compare pwHash to correct pwHash
  (req, res, next) => {
    if (res.locals.pwHash !== res.locals.correctPwHash) {
      logger.log(
        `leaderPwCheck: wrong hash ${res.locals.pwHash.substring(
          0,
          3
        )}... !== ${res.locals.correctPwHash.substring(0, 3)}...`
      );
      return res.status(400).send(responses.BAD_REQUEST);
    }
    return next();
  },
];
module.exports = leaderPwCheck;
