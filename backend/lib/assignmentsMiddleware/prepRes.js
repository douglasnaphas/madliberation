/**
 * pre: res.locals.dbData.Items[0] is an object like
 * {
 *   assignments: [
 *     {id: '..', sentence: '..', defaultAnswer: '..', prompt: '..',
 *       example: '..'},
 *     ...
 *   ]
 * }
 * post: res.locals.assignments is an array like
 * [
 *   {id: '..', sentence: '..', prompt: '..', example: '..'}
 * ]
 * that is, dbData.Items with the defaultAnswer removed.
 */
function prepRes() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.dbData || !Array.isArray(res.locals.dbData.Items) ||
      !Array.isArray(res.locals.dbData.Items[0].assignments)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.assignments = res.locals.dbData.Items[0].assignments.map(
      a => {
      const assignment = {};
      if(a.id) assignment.id = a.id;
      if(a.sentence) assignment.sentence = a.sentence;
      if(a.prompt) assignment.prompt = a.prompt;
      if(a.example) assignment.example = a.example;
      return assignment;
    });
    return next();
  };
  return middleware;
}
module.exports = prepRes;