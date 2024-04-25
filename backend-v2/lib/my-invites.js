const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const schema = require("../schema");
const dynamoDBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
const myInvites = () => [
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
    const getMyInvitesQueryCommand = new QueryCommand({
      TableName: schema.TABLE_NAME,
      IndexName: schema.PARTICIPANT_EMAIL_INDEX,
      KeyConditionExpression: `#EM = :em`,
      ExpressionAttributeNames: { "#EM": schema.EMAIL },
      ExpressionAttributeValues: { ":em": res.locals.user_email },
    });
    const getMyInvitesQueryResponse = await docClient.send(
      getMyInvitesQueryCommand
    );
    if (!getMyInvitesQueryResponse) {
      console.log(
        "problem getting participant's seders, getMyInvitesQueryResponse",
        getMyInvitesQueryResponse
      );
      return res.status(500).send({ err: "server error" });
    }
    if (
      !getMyInvitesQueryResponse.Items ||
      !Array.isArray(getMyInvitesQueryResponse.Items)
    ) {
      return res.send([]);
    }
    try {
      res.locals.myInvites = getMyInvitesQueryResponse.Items.filter((item) =>
        item.lib_id.startsWith(
          `${schema.PARTICIPANT_PREFIX}${schema.SEPARATOR}`
        )
      ).map((item) => {
        return {
          room_code: item.room_code,
          participant_pw: item.participant_pw[0],
          ph: item.lib_id.split(schema.SEPARATOR)[1],
        };
      });
    } catch (err) {
      console.log(
        "my-invites: problem getting seders from query response",
        res.locals.user_email
      );
      console.log(err);
      return res.status(500).send({ err: "server error" });
    }
    return res.send(res.locals.myInvites);
  },
];
module.exports = myInvites;
