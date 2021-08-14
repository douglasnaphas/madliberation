/**
 * Return middleware satisfying:
 * pre: res.locals.dbError and res.locals.dbData are populated with the results
 * from querying the database
 * post:
 *   - if dbError is truthy and either of the query's condition checks failed,
 * send 400 with an explanation (room code bad or game name taken)
 *   - if dbError is truthy and we cannot determine that a condition check
 * failed, send 500
 *   - call next otherwise
 * @return {Function} Express middleware that sends 400 on discernable query
 * error, sends 500 on other error, or calls next on no error
 */
function handleQueryErrors() {
  const configs = require('../../Configs');
  const middleware = (req, res, next) => {
    if(!res.locals.dbError) {
      return next();
    }
    const generalErrorMessage = 'We could not join you to this ' +
      'seder, please double-check your Room Code, make sure it is not more' +
      ' than ' + configs.msToJoinSeder() / 1000 / 60 + ' minutes old, and ' +
      'try again, or try a different Game Name or with a different browser' +
      ' or device';
    if(!res.locals.dbError.message) {
      return res.status(500).send({err: generalErrorMessage});
    }
    const failures = res.locals.dbError.message.replace(/^[^[]+[[]/, '').
      replace(/]$/, '').split(',');
    if(failures.length < 2) {
      return res.status(500).send({err: generalErrorMessage});
    }
    const conditionalCheckFailedRegex = /^\s*Condition.*CheckFailed\s*$/;
    if(failures[0].match(conditionalCheckFailedRegex)) {
      return res.status(400).send({err: 'Either that Room Code does not ' +
        'exist, or it has expired, or the person who started the seder ' +
        'confirmed that everyone had joined. Room Codes expire after ' +
        configs.msToJoinSeder() / 1000 / 60 + ' minutes'});
    }
    if(failures[1].match(conditionalCheckFailedRegex)) {
      return res.status(400).send({err: 'That Game Name is taken for this ' +
        'seder, please try another Game Name or find the person who took it ' +
        'and steal their phone'});
    }
    return res.status(500).send({err: generalErrorMessage});
  };
  return middleware;
}
module.exports = handleQueryErrors;