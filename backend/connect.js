const DynamoDB = require("aws-sdk/clients/dynamodb");
const schema = require("./schema");
const db = new DynamoDB.DocumentClient();
const crypto = require("crypto");
const logger = require("./logger");

exports.handler = async function (event, context, callback) {
  logger.log("connect handler called");
  logger.log("event:");
  logger.log(JSON.stringify(event));
  logger.log("context:");
  logger.log(JSON.stringify(context));

  // validate the connection request
  if (
    !event ||
    !event.queryStringParameters ||
    !event.queryStringParameters.roomcode ||
    !event.queryStringParameters.gamename
  ) {
    logger.log("missing queryStringParameters");
    return { statusCode: 400, body: "Bad request" };
  }

  const roomCode = event.queryStringParameters.roomcode;
  const gameName = decodeURIComponent(event.queryStringParameters.gamename);
  const hash = crypto.createHash("sha256");
  hash.update(gameName);
  const gameNameHash = hash.digest("hex").substring(0, len).toLowerCase();
  if (!event.multiValueHeaders || !event.multiValueHeaders.Cookie) {
    logger.log("no cookies");
    return { statusCode: 400, body: "Bad request" };
  }
  const gameCookie = event.multiValueHeaders.Cookie.find((cookie) =>
    new RegExp(`^${gameNameHash}=.`).test(cookie)
  );
  const RIGHT_HAND_SIDE = 1;
  const cookieSessionKey = gameCookie.split("=")[RIGHT_HAND_SIDE];
  if (!gameCookie || !cookieSessionKey) {
    logger.log("no cookie with the right name, looking for " + gameNameHash);
    return { statusCode: 400, body: "Bad request" };
  }
  const getParticipantParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [schema.PARTITION_KEY]: roomCode,
      [schema.SORT_KEY]:
        `${schema.PARTICIPANT_PREFIX}` +
        `${schema.SEPARATOR}` +
        `${gameNameHash}`,
    },
  };
  try {
    const participantData = await db.get(getParticipantParams).promise();
    if (participantData.Item[schema.SESSION_KEY] != cookieSessionKey) {
      logger.log("session key mismatch");
      return { statusCode: 400, body: "Bad request" };
    }
  } catch (e) {
    logger.log("error getting participant data", e);
    return { statusCode: 500, body: "Server error" };
  }

  const now = new Date();
  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      [schema.PARTITION_KEY]: `CHECK?PARAMS`, // need to see if event has params
      [schema.SORT_KEY]:
        `${schema.CONNECT}` +
        `${schema.SEPARATOR}` +
        `${event.requestContext.connectionId}`,
      [schema.CONNECTION_ID]: event.requestContext.connectionId,
      [schema.DATE]: now.toISOString(),
      [schema.MS]: now.getTime(),
    },
  };

  try {
    // Insert incoming connection id in the db
    await db.put(putParams).promise();

    return {
      statusCode: 200,
      body: "Connected",
    };
  } catch (e) {
    console.error("connect error!", e);
    return {
      statusCode: 501,
      body: "Failed to connect: " + JSON.stringify(e),
    };
  }
};
