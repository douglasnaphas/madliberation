/**
 * Return middleware satisfying:
 * pre: res.locals.dbData contains an Items property, which is an array of
 * {game_name: 'game name'} objects
 * post: res.locals.participants is a sorted array of the game_name string
 * values
 * @return {Function} Express middleware that calls next after setting
 * res.locals.participants, sends 500 on error
 */
function sortParticipants() {
  const middleware = (req, res, next) => {
    const responses = require("../../responses");
    const schema = require("../../schema");
    const logger = require("../../logger");
    const api = require("../../api");
    if (
      !res.locals.dbData ||
      !res.locals.dbData.Items ||
      !Array.isArray(res.locals.dbData.Items)
    ) {
      logger.log("sortParticipants: bad dbData, locals:");
      logger.log(res.locals);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    logger.log("DEBUG sortParticipants: about to split undefined, locals:");
    logger.log(res.locals);
    logger.log("DEBUG sortParticipants, Items:");
    logger.log(res.locals.dbData.Items);
    let participants = res.locals.dbData.Items.map((item) => {
      const PARTICIPANT_HASH_INDEX = 1;
      return {
        [schema.GAME_NAME]: item.game_name,
        [schema.EMAIL]: item[schema.EMAIL],
        [schema.PARTICIPANT_PW]: item[schema.PARTICIPANT_PW],
        [api.PARTICIPANT_HASH]: item[schema.SORT_KEY].split(schema.SEPARATOR)[
          PARTICIPANT_HASH_INDEX
        ],
      };
    });
    res.locals.participants = participants.sort((a, b) => {
      if (new String(a).toLowerCase() < new String(b).toLowerCase()) return -1;
      if (new String(a).toLowerCase() > new String(b).toLowerCase()) return 1;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    return next();
  };
  return middleware;
}
module.exports = sortParticipants;
