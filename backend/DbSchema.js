const schema = require('./schema');
const getHash = require('./lib/getHash');
class DbSchema {
  static sortKeyFromGameName(gameName) {
    return schema.PARTICIPANT_PREFIX + schema.SEPARATOR + getHash(gameName);
  }
}
module.exports = DbSchema;