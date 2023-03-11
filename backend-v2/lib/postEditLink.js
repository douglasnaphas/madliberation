const checkBody = require("./checkBody");
const validator = require("email-validator");
const AWS = require("aws-sdk");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const schema = require("../schema");
const responses = require("../responses");
const logger = require("../logger");
const randomCapGenerator = require("./randomCapGenerator");
const Configs = require("../Configs");
const sederCode = require("./seder-code");

const postEditLink = [
  // fail if there's no path and leaderEmail
  checkBody(["path", "leaderEmail"]),
  // make sure leaderEmail is OK
  (req, res, next) => {
    if (validator.validate(req.body.leaderEmail)) {
      return next();
    }
    return res
      .status(400)
      .send({ err: "leaderEmail should be an email address" });
  },
  // make sure path is OK
  async (req, res, next) => {
    const params = {
      TableName: schema.TABLE_NAME,
      IndexName: schema.SCRIPTS_INDEX,
      ExpressionAttributeNames: {
        "#IS": schema.SCRIPTS_PART_KEY,
      },
      ExpressionAttributeValues: {
        ":is": 1,
      },
      KeyConditionExpression: "#IS = :is",
    };
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.query(params, (err, data) => {
        resolve({ err: err, data: data });
      });
    });
    if (dbResponse.err) {
      logger.log("error retrieving scripts at /edit-link");
      logger.log(dbResponse.err);
      return res.status(500).send({ err: dbResponse.err });
    }
    if (
      !dbResponse.data ||
      !dbResponse.data.Items ||
      !Array.isArray(dbResponse.data.Items)
    ) {
      logger.log("unexpected db response in /edit-link");
      logger.log(dbResponse);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if (dbResponse.data.Items.find((s) => s.path === req.body.path) < 0) {
      return res.status(400).send({ err: "bad path" });
    }
    return next();
  },
  // save path and leaderEmail in locals
  (req, res, next) => {
    res.locals.path = req.body.path;
    res.locals.leaderEmail = req.body.leaderEmail;
    return next();
  },
  // generate password, save it and its hash in locals
  (req, res, next) => {
    const pwSequence = randomCapGenerator({
      letters: Configs.LEADER_PW_LENGTH,
    });
    const pw = pwSequence.next().value;
    res.locals.pw = pw;
    const crypto = require("crypto");
    const pwHash = crypto
      .createHash("sha256")
      .update(pw)
      .digest("hex")
      .toLowerCase();
    res.locals.pwHash = pwHash;
    return next();
  },
  // generate seder code, save in db w other locals, and in locals
  sederCode({
    dynamoDBDocumentClient: DynamoDBDocumentClient,
    putCommand: PutCommand,
    dynamoDBClient: DynamoDBClient,
    configs: Configs,
  }),
  // send response
  (req, res, next) => {
    return res.send({ data: { sederCode: res.locals.sederCode, pw: res.locals.pw } });
  },
];
module.exports = postEditLink;
