const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const schema = require("../schema");
const dynamoDBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
const mySeders = () => [
  // 401 if no login cookie
  (req, res, next) => {
    if (!req.cookies.login) {
      return res.status(401).send({ err: "unauthenticated" });
    }
    return next();
  },
  // Get the cookie from the db, note the user email
  async (req, res, next) => {
    const getCookieQueryCommand = new QueryCommand({
      TableName: schema.TABLE_NAME,
      IndexName: schema.OPAQUE_COOKIE_INDEX,
      KeyConditionExpression: `#OC = :oc`,
      ExpressionAttributeNames: { "#OC": schema.OPAQUE_COOKIE },
      ExpressionAttributeValues: { ":oc": req.cookies.login },
    });
    const getCookieQueryResponse = await docClient.send(getCookieQueryCommand);
    if (
      !getCookieQueryResponse ||
      !getCookieQueryResponse.Items ||
      !getCookieQueryResponse.Items[0]
    ) {
      console.log(
        "problem getting user nickname and email, getCookieQueryResponse",
        getCookieQueryResponse
      );
      return res.status(401).send({ err: "unauthenticated" });
    }
    const { user_nickname, user_email } = getCookieQueryResponse.Items[0];
    res.locals.user_email = user_email;
    return next();
  },
  // Get the seders the user started
  async (req, res, next) => {
    const getMySedersQueryCommand = new QueryCommand({
      TableName: schema.TABLE_NAME,
      IndexName: schema.LEADER_EMAIL_INDEX,
      KeyConditionExpression: `#LE = :le`,
      ExpressionAttributeNames: { "#LE": schema.LEADER_EMAIL },
      ExpressionAttributeValues: { ":le": res.locals.user_email },
    });
    const getMySedersQueryResponse = await docClient.send(
      getMySedersQueryCommand
    );
    if (!getMySedersQueryResponse) {
      console.log(
        "problem getting leader's seders, getMySedersQueryResponse",
        getMySedersQueryResponse
      );
      return res.status(500).send({ err: "server error" });
    }
    if (
      !getMySedersQueryResponse.Items ||
      !Array.isArray(getMySedersQueryResponse.Items)
    ) {
      return res.send([]);
    }
    try {
      res.locals.mySeders = getMySedersQueryResponse.Items.filter(
        (item) => item.lib_id === schema.SEDER_PREFIX
      ).map((item) => {
        return {
          room_code: item.room_code,
          created: item.created,
          pw: item.pw,
          timestamp: item.timestamp,
        };
      });
    } catch (err) {
      console.log(
        "my-seders: problem getting seders from query response",
        res.locals.user_email
      );
      console.log(err);
      return res.status(500).send({ err: "server error" });
    }
    return res.send(res.locals.mySeders);
  },
];
module.exports = mySeders;
