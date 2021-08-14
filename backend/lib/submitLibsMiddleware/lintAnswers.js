/**
 * pre: req.body.answers is set
 * post:
 *   1) if answers is not an array, 400
 *   2) if any answers entry is missing a numeric id, 400
 */
function lintAnswers() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!Array.isArray(req.body.answers)) {
      return res.status(400).send(responses.BAD_REQUEST);
    }
    for(let i = 0; i < req.body.answers.length; i++) {
      if(!Number.isInteger(req.body.answers[i].id)) {
        return res.status(400).send(responses.BAD_REQUEST);
      }
    }
    return next();
  };
  return middleware;
}
module.exports = lintAnswers;