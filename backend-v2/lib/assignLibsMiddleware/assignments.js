/**
 * pre:
 *   1) res.locals.libs is an array of libs
 *   2) res.locals.participants is an array of {lib_id: 'participant#<hash>'}
 *      objects, where <hash> is the hash that appears in the lib_id DB column
 * post:
 *   1) res.locals.participants' entries each have libs: [{<lib>}], where each
 *      <lib> is a lib from res.locals.libs, assigned to the participant
 *   2) no participant has more than one more lib than any other participant
 */
function assignments() {
  const responses = require('../../responses');
  const randomNumber = require('../randomNumber');
  const Logger = require('../Logger');
  const middleware = (req, res, next) => {
    if(!res.locals.libs || !res.locals.participants ||
      !Array.isArray(res.locals.libs) ||
      !Array.isArray(res.locals.participants) ||
      res.locals.participants.length == 0) {
      Logger.log({event: 'assignLibsMiddleware/assignments',
        ob: [Array.isArray(res.locals.libs),
        Array.isArray(res.locals.participants)], status: 500});
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.participants.forEach(p => {
      p.libs = [];
    });
    const libsToAssign = res.locals.libs.map(lib => lib);
    let i = 0;
    while(libsToAssign.length > 0) {
      let j = randomNumber(0, libsToAssign.length - 1);
      let lib = libsToAssign.splice(j, 1)[0];
      res.locals.participants[i].libs.push(lib);
      i = (i + 1) % res.locals.participants.length;
    }
    return next();
  };
  return middleware;
}
module.exports = assignments;