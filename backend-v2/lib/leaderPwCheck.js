const responses = require("../responses");
const leaderPwCheck = [
  (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }
    if (req.query && req.query.sederCode && req.query.pw) {
      res.locals.sederCode = req.query.sederCode;
      res.locals.pw = req.query.pw;
      return next();
    }
    return res.status(400).send({ err: "need sederCode and pw query params" });
  },
  (req, res, next) => {
    if (!["POST", "DELETE", "PUT", "PATCH"].includes(req.method)) {
      return next();
    }
    if (req.body && req.body.sederCode && req.body.pw) {
      res.locals.sederCode = req.body.sederCode;
      res.locals.pw = req.body.pw;
      return next();
    }
    return res.status(400).send({ err: "need sederCode and pw params" });
  },
];
module.exports = leaderPwCheck;
