const checkBody = require("./checkBody");
const validator = require("email-validator");
const postEditLink = [
  // fail if there's no path and leaderEmail
  checkBody(["path", "leaderEmail"]),
  // make sure leaderEmail is OK]
  (req, res, next) => {
    if (validator.validate(req.body.leaderEmail)) {
      return next();
    }
    return res
      .status(400)
      .send({ err: "leaderEmail should be an email address" });
  },
  // save path and leaderEmail in locals
  // generate password, save in locals
  // generate seder code, save in db w other locals, and in locals
  // send response
  (req, res, next) => {
    res.send({ data: { sederCode: "SOME-SEQU-ENCE-LTRS" } });
  },
];
module.exports = postEditLink;
