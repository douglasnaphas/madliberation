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
    if (
      !res.locals.dbData ||
      !res.locals.dbData.Items ||
      !Array.isArray(res.locals.dbData.Items)
    ) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    let participants = res.locals.dbData.Items.map((item) => {
      return {
        [schema.GAME_NAME]: item.game_name,
        [schema.EMAIL]: item[schema.EMAIL],
        [schema.PARTICIPANT_PW]: item[schema.PARTICIPANT_PW],
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
