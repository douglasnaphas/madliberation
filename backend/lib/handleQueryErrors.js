/**
 * Return middleware satisfying:
 * pre: res.locals.dbError and res.locals.dbData are populated with the results
 * from querying the database
 * post: if dbError is truthy, send 500; call next otherwise
 * @return {Function} Express middleware that sends 500 on query error, calls
 * next otherwise
 */
function handleQueryErrors() {
  const Logger = require('./Logger');
  const middleware = (req, res, next) => {
    const responses = require('../responses');
    if(Array.isArray(res.locals.dbError)) {
      let dbErrors = res.locals.dbError;
      for(let i = 0; i < dbErrors.length; i++) {
        if(dbErrors[i]) {
          Logger.log({ob: [i, dbErrors[i]]});
          return res.status(500).send(responses.SERVER_ERROR);
        }
      }
      return next();
    }
    
    if(res.locals.dbError || !res.locals.dbData) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    return next();
  };
  return middleware;
}
module.exports = handleQueryErrors;