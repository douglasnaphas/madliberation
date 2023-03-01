const checkBody = require("./checkBody");
const validator = require("email-validator");
const AWS = require("aws-sdk");
const schema = require("./schema");
const responses = require("../responses");
const logger = require("../logger");
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
  // generate password, save in locals
  // generate seder code, save in db w other locals, and in locals
  // send response
  (req, res, next) => {
    res.send({ data: { sederCode: "SOME-SEQU-ENCE-LTRS" } });
  },
];
module.exports = postEditLink;
