const checkBody = require("./checkBody")
const postEditLink = [
  // fail if there's no path and leaderEmail
  checkBody(["path", "leaderEmail"]),
  // save path and leaderEmail in locals
  // generate password, save in locals
  // generate seder code, save in db w other locals, and in locals
  // send response
  (req, res, next) => {
    res.send({ data: { sederCode: "SOME-SEQU-ENCE-LTRS" } });
  },
];
module.exports = postEditLink;
