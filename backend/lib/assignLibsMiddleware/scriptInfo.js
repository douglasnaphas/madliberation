/**
 * pre: res.locals.s3Data contains the results from fetching the script
 * post:
 *   1) res.locals.scriptVersion contains the VersionId of the script
 *   2) res.locals.libs contains an array of lib objects in the order they
 *      appear in the script
 * 500 on error.
 */
function scriptInfo() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.s3Data ||
       !res.locals.s3Data.Body) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.scriptVersion = res.locals.s3Data.VersionId;
    const libs = [];
    const buf = new Buffer(res.locals.s3Data.Body);
    const script = JSON.parse(buf.toString('utf8'));
    if(!Array.isArray(script.pages)) return next();
    let id = 1;
    script.pages.forEach(page => {
      if(!Array.isArray(page.lines)) return;
      page.lines.forEach(line => {
        if(!Array.isArray(line.segments)) return;
        line.segments.forEach(segment => {
          if(segment.type != 'lib') return;
          const lib = {};
          lib.id = id;
          ['prompt', 'example', 'sentence']
            .forEach(p =>{
              if(segment[p] != '') lib[p] = segment[p];
            });
          if(segment['default'] != '') lib['defaultAnswer'] = segment.default;
          libs.push(lib);
          id++;
        });
      });
    });
    res.locals.libs = libs;
    return next();
  };
  return middleware;
}
module.exports = scriptInfo;