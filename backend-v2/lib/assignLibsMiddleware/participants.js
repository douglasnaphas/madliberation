/**
 * pre: res.locals.dbData.Items is an array of participant sort keys
 * post: res.locals.participants is an array of participant sort keys
 * 500 on error.
 */
function participants() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.dbData ||
       !res.locals.dbData.Items ||
       !Array.isArray(res.locals.dbData.Items)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.participants = res.locals.dbData.Items;
    return next();
  };
  return middleware;
}
module.exports = participants;