const schema = require("../../schema");
const getHash = require("../getHash");
const awsSdk = require("aws-sdk");
const validator = require("email-validator");
const crypto = require("crypto");
const {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const checkBody = require("../checkBody");
const hashGameName = require("./hashGameName");
const dbParams = require("./dbParams");
const runQuery = require("./runQuery");
const handleQueryErrors = require("./handleQueryErrors");
const succeed = require("./succeed");
const logger = require("../../logger");

const removeParticipantMiddleware = [
  // check for required body params
  checkBody(["sederCode", "pw", "email", "gameName"]),
  // make sure email is ok
  (req, res, next) => {
    if (validator.validate(req.body.email)) {
      return next();
    }
    return res.status(400).send({ err: "email should be an email address" });
  },
  // save pwHash
  (req, res, next) => {
    const pwHash = crypto
      .createHash("sha256")
      .update(req.body.pw)
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
        room_code: req.body.sederCode,
        lib_id: schema.SEDER_PREFIX,
      },
    };
    try {
      const response = await ddbDocClient.send(new GetCommand(getParams));
      res.locals.correctPwHash = response.Item.pwHash;
      logger.log(
        `v2/joinSederMiddleware: saved correctPwHash starting ${res.locals.correctPwHash.substring(
          0,
          3
        )}`
      );
      return next();
    } catch (error) {
      logger.log("v2/joinSederMiddleware: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check pwHash, return or reject
  (req, res, next) => {
    if (res.locals.pwHash !== res.locals.correctPwHash) {
      logger.log(
        `v2/joinSederMiddleware: wrong hash ${res.locals.pwHash.substring(
          0,
          3
        )}... !== ${res.locals.correctPwHash.substring(0, 3)}...`
      );
      return res.status(400).send(responses.BAD_REQUEST);
    }
    return next();
  },
  // hash game name
  hashGameName(getHash),
  // delete the participant from the db
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const deleteParams = {
      TableName: schema.TABLE_NAME,
      Key: {
        room_code: req.body.sederCode,
        lib_id:
          schema.PARTICIPANT_PREFIX +
          schema.SEPARATOR +
          res.locals.gameNameHash,
      },
      ConditionExpression: "attribute_not_exists(assignments)",
    };
    try {
      const response = await ddbDocClient.send(new DeleteCommand(deleteParams));
      logger.log("deleteParticipant: remove participant " + req.body.gameName);
      return res.send({ message: req.body.gameName + " removed" });
    } catch (err) {
      logger.log(
        "deleteParticipant: failed to remove participant " + req.body.gameName
      );
      return res.status(500).send();
    }
  },
];
module.exports = removeParticipantMiddleware;
