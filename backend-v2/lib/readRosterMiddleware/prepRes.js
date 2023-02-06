/**
 * pre: res.locals.dbData.Items is an array of objects like
 * {
 *   game_name: 'STRING',
 *   answers: [
 *     {id: NUMBER, answer: 'STRING'}
 *   ]
 * }
 * or like
 * {
 *   game_name: 'STRING'
 * }
 * that is, participant names with or without the answers property populated.
 * post:
 *   1) res.locals.done is an array of strings, the alphabetically sorted list
 *      of names of participants who have submitted answers
 *   2) res.locals.notDone is an array of strings, the alphabetically sorted
 *      list of names of participants who have not submitted answers
 */
function prepRes() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.dbData || !Array.isArray(res.locals.dbData.Items)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.done = [];
    res.locals.notDone = [];
    for(let i = 0; i < res.locals.dbData.Items.length; i++) {
      const item = res.locals.dbData.Items[i];
      if(item.game_name) {
        if(Array.isArray(item.answers)) {
          res.locals.done.push(item.game_name);
        } else {
          res.locals.notDone.push(item.game_name);
        }
      }
    }
    res.locals.done.sort();
    res.locals.notDone.sort();
    return next();
  };
  return middleware;
}
module.exports = prepRes;