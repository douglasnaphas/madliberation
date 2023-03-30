const checkQueryParams = require("./checkQueryParams");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const logger = require("../logger");
const schema = require("../schema");
const responses = require("../responses");
const api = require("../api");
const getGameName = [
  // return answers map
  (req, res, next) => {
    return res.send({ gameName: res.locals.participant[schema.GAME_NAME] });
  },
];
module.exports = getGameName;
