const checkParams = require("./checkParams");
const dbParams = require("./dbParams");
const runQuery = require("../runQuery");
const awsSdk = require("aws-sdk");
const handleQueryErrors = require("../handleQueryErrors");
const sortParticipants = require("./sortParticipants");
const checkQueryParams = require("../checkQueryParams");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");

/**
 * Return a sorted JSON array of the Game Names of participants in this seder.
 * Send 400 with "bad request" if the seder identified by the roomcode in the
 * query params does not exist.
 */
const invites = [
  // check for required params
  checkQueryParams(["sederCode", "pw", "roomCode"]),
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
  // get correctPwHash and path from the db
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
        `invites: saved correctPwHash starting ${res.locals.correctPwHash.substring(
          0,
          3
        )}`
      );
      return next();
    } catch (error) {
      logger.log("invites: error getting item from db, error:");
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
  // check pwHash, return or reject
  (req, res, next) => {
    if (res.locals.pwHash !== res.locals.correctPwHash) {
      logger.log(
        `invites: wrong hash ${res.locals.pwHash.substring(
          0,
          3
        )}... !== ${res.locals.correctPwHash.substring(0, 3)}...`
      );
      return res.status(400).send(responses.BAD_REQUEST);
    }
    return next();
  },
  // set db params
  dbParams(),
  // run query
  runQuery(awsSdk, "rosterDbParams"),
  // handle errors from the query
  handleQueryErrors(),
  // sort the participants
  sortParticipants(),
  // success, send res.locals.participants
  (req, res) => {
    res.send({ participants: res.locals.participants });
  },
];

module.exports = invites;
