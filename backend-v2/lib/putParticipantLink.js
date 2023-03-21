const checkQueryParams = require("./checkQueryParams");
const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const randomCapGenerator = require("./randomCapGenerator");
const Configs = require("../Configs");
/**
 * This is only for creating a participant pw for a participant who doesn't
 * have one. Use addParticipantLink if the participant already has a pw.
 */
const putParticipantLink = [
  // make sure we have a gameNameHash
  (req, res, next) => {
    if (!res.locals.gameNameHash) {
      logger.log(`putParticipantLink: no gameNameHash`);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    return next();
  },
  // Generate participantPw, save it in locals
  (req, res, next) => {
    const participantPwSequence = randomCapGenerator({
      letters: Configs.PARTICIPANT_PW_LENGTH,
    });
    const participantPw = participantPwSequence.next().value;
    res.locals.participantPw = participantPw;
    return next();
  },
  // Save participantPw in db in a list
  async (req, res, next) => {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const ddbClient = new DynamoDBClient({ region });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    const updateParams = {
      TableName: schema.TABLE_NAME,
      Key: {
        room_code: req.query.sederCode,
        lib_id:
          schema.PARTICIPANT_PREFIX +
          schema.SEPARATOR +
          res.locals.gameNameHash,
      },
      UpdateExpression: "SET #pp = :nl", // participantPw = new list
      ExpressionAttributeNames: { "#pp": schema.PARTICIPANT_PW },
      ExpressionAttributeValues: { ":nl": [res.locals.participantPw] },
      ConditionExpression: "attribute_not_exists(#pp)",
      ReturnValues: "ALL_NEW",
    };
    try {
      const response = await ddbDocClient.send(new UpdateCommand(updateParams));
      logger.log(
        `putParticipantLink: successfully saved participantPw for sederCode ${req.query.sederCode}, gameNameHash ${res.locals.gameNameHash}`
      );
      return next();
    } catch (error) {
      logger.log(`putParticipantLink: error writing participantPw:`);
      logger.log(error);
      return res.status(500).send(responses.SERVER_ERROR);
    }
  },
];
module.exports = putParticipantLink;
