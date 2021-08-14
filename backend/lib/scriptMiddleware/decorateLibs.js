/**
 * pre:
 *   1) res.locals.script is the script, parsed to an object
 *   2) res.locals.answers is an array of objects like {id: NUMBER, answer:
 *      STRING}, sorted by id, ids not necessarily contiguous, for example:
 *      [{id: 1, answer: 'one'}, {id: 6, answer: 'six'}] could happen; ids
 *      correspond to the order in which the answered lib appears in the script
 * post:
 *   1) res.locals.script's libs contain ids in order
 *   2) res.locals.script's libs don't have example, sentence, or defaultAnswer
 *      properties
 *   3) res.locals.script's libs have answers from res.locals.answers, with the
 *      ids matching up between scripts and answers
 */
function decorateLibs() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.script || !Array.isArray(res.locals.script.pages) ||
      !Array.isArray(res.locals.answers)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const answers = [];
    res.locals.answers.forEach(answer => {
      answers[answer.id] = answer.answer;
    });
    let id = 1;
    res.locals.script.pages.forEach(page => {
      if(!Array.isArray(page.lines)) return;
      page.lines.forEach(line => {
        if(!Array.isArray(line.segments)) return;
        line.segments.forEach(segment => {
          if(segment.type != 'lib') return;
          segment.id = id;
          segment.example = undefined;
          segment.sentence = undefined;
          segment['default'] = undefined;
          segment.answer = answers[id];
          id++;
        });
      });
    });
    return next();
  };
  return middleware;
}
module.exports = decorateLibs;