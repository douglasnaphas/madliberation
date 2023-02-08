/**
 * pre:
 *   1) res.locals.dbData.Items is an array
 *   2) Items contains an entry with path and script_version properties
 *   3) Items contains one or more other entries, each of which
 *      a) has an assignments property like
 *         [{id: NUMBER, defaultAnswer: STRING, prompt: STRING, ...}, ...]
 *      b) optionally has an answers property like
 *         [{id: NUMBER, answer: STRING}], answer optional
 * post:
 *   1) res.locals.path is the path
 *   2) res.locals.version is the script_version
 *   3) res.locals.answers is like [{id: NUMBER, answer: STRING}, ... ], where
 *      a) the id matched an id in assignments for that item (the lib was
 *         assigned to the submitter)
 *      b) defaultAnswer is used for answer where answer was missing
 *      c) the array is sorted by id
 */
function saveSederInfo() {
  const middleware = (req, res, next) => {
    const responses = require('../../responses');
    const schema = require('../../schema');
    if(!res.locals.dbData ||
      !Array.isArray(res.locals.dbData.Items) ||
      res.locals.dbData.Items.length < 2) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const items = res.locals.dbData.Items;
    res.locals.path = res.locals.version = false;
    res.locals.answers = [];
    for(let i = 0; i < items.length; i++) {
      res.locals.path = res.locals.path || items[i][schema.PATH];
      res.locals.version = res.locals.version ||
        items[i][schema.SCRIPT_VERSION];
      const answers = [];
      if(Array.isArray(items[i].answers)) {
        // make it easy to look up answers by id
        for(let j = 0; j < items[i].answers.length; j++) {
          if(Number.isInteger(items[i].answers[j].id)) {
            answers[items[i].answers[j].id] =
              items[i].answers[j].answer;
          }
        }
      }
      if(Array.isArray(items[i].assignments)) {
        for(let j = 0; j < items[i].assignments.length; j++) {
          if(Number.isInteger(items[i].assignments[j].id)) {
            res.locals.answers.push({
              id: items[i].assignments[j].id,
              answer: answers[items[i].assignments[j].id] ||
                items[i].assignments[j].defaultAnswer
            });
          }
        }
      }
    }
    res.locals.answers.sort((a, b) => {
      if(a.id < b.id) return -1;
      if(a.id > b.id) return 1;
      return 0;
    });
    if(!res.locals.path || !res.locals.version) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    return next();
  };
  return middleware;
}
module.exports = saveSederInfo;