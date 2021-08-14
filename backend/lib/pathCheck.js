/**
 * Generate Express middelware to validate the path where the script is stored
 * in the request body.
 * @param {Object} options The options, including:
 *   * {regex} pathRegex The regex to check path against, default
 *     /^[-a-zA-Z0-9/_]+$/
 * @return Express middleware that calls next if req.body.path matches options.
 * pathRegex, sends a 400 response otherwise.
 */ 
function pathCheck(options) {
  const pathRegex = (options && options.pathRegex) || /^[-a-zA-Z0-9/_]+$/;
  const middleware = (req, res, next) => {
    if(! req ||
       ! req.body ||
       ! req.body.path ||
       ! req.body.path.match(pathRegex)) {
      res.status(400).send();
    }
    next();
  }
  return middleware;
}
module.exports = pathCheck;