/**
 * Return an Express-friendly function satisfying:
 * pre: res.locals.{path,leaderEmail,pwHash} are populated with strings
 * post:
 *   - a Seder Code that is 12 uppercase letters and has not previously been issued as a Seder Code is saved at res.locals.sederCode
 *   - path, leaderEmail, and pwHash from res.locals are saved in the db with PK equal to the Seder Code and SK equal to schema.SEDER_PREFIX
 * return next() on success
 * 500 on error
 * @param dynamoDBDocumentClient like @aws-sdk/lib-dynamodb's DynamoDBDocumentClient
 * @param putCommand like @aws-sdk/lib-dynamodb's PutCommand
 * @param dynamoDBClient like @aws-sdk/client-dynamodb's DynamoDBClient
 * @param {Function*} roomCodeGenerator A Generator that yields a series of
 *   room codes, default randomCapGenerator.js.
 * @param configs An object with:
 *   - a roomCodeRetries method that returns an int
 *   - a SEDER_CODE_LENGTH int property
 */
function sederCode({
  dynamoDBDocumentClient,
  putCommand,
  dynamoDBClient,
  roomCodeGenerator,
  configs,
}) {
  const schema = require("../schema");
  const logger = require("../logger");
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const ddbClient = new dynamoDBClient({
    region: region,
  });
  const ddbDocClient = dynamoDBDocumentClient.from(ddbClient);

  const f = async (req, res, next) => {
    if (!req || !req.body || !req.body.path) {
      res.status(400).send();
    }
    roomCodeGenerator = roomCodeGenerator || require("./randomCapGenerator");
    const roomCodeSequence = roomCodeGenerator({
      letters: configs.SEDER_CODE_LENGTH,
    });
    let code;
    let putParams;
    let putResponse;
    let success;
    success = false;
    const attempts = configs.roomCodeRetries();
    for (let i = 0; !success && i < attempts; i++) {
      code = roomCodeSequence.next().value;
      const now = new Date();
      putParams = {
        TableName: schema.TABLE_NAME,
        Item: {
          room_code: code,
          lib_id: schema.SEDER_PREFIX,
          timestamp: now.toISOString(),
          created: now.getTime(),
          path: res.locals.path,
          leaderEmail: res.locals.leaderEmail,
          pwHash: res.locals.pwHash,
          leaderName: res.locals.leaderName,
        },
        ConditionExpression: "attribute_not_exists(room_code)",
      };
      // leaderEmail is part of the v2/async/email address-based/2023 flow
      // userEmail is for when they've been authenticated by Cognito
      // TODO: What if they're not the same?
      if (res.locals.userEmail) {
        putParams.Item[schema.USER_EMAIL] = {
          S: res.locals.userEmail,
        };
      }
      try {
        logger.log(`seder-code: attempting to save ${code}`);
        putResponse = await ddbDocClient.send(new putCommand(putParams));
        logger.log(`seder-code: successfully saved ${code}`);
        logger.log(`seder-code: putResponse:`);
        logger.log(putResponse);
        res.locals.sederCode = code;
        return next();
      } catch (error) {
        logger.log(`seder-code: collision, code: ${code}`);
        logger.log(`seder-code: error:`);
        logger.log(error);
      }
    }
    logger.log(`seder-code: failed to generate room code`);
    return res.status(500).send({ error: "could not generate seder code" });
  };
  return f;
}
module.exports = sederCode;
