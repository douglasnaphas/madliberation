const conditionalMidware = (condition, middleware) => {
  if(condition) return middleware;
  return (req, res, next) => next();
};
module.exports = conditionalMidware;