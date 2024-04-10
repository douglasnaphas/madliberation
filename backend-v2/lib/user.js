const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const schema = require("../schema");
const dynamoDBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
const user = () => [
  // 401 if no login cookie
  (req, res, next) => {
    if (!req.cookies.login) {
      return res.status(401).send({ err: "unauthenticated" });
    }
    return next();
  },
  // Get the cookie from the db
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
    return res.send({ user_nickname, user_email });
  },
];
module.exports = user;
