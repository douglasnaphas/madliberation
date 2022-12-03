const logger = require("../logger");
/**
 * @return middleware satisfying:
 *   pre: res.locals.id_token is set to a JWT
 *   post: res.locals contains properties nickname, email, sub, and
 *     cognito:username from the JWT claims, 500 on error
 */
const getUserInfo = (jwt) => {
  const middleware = (req, res, next) => {
    try {
      logger.log("******** getUserInfo: id_token *********");
      logger.log(res.locals.id_token);
      const decodedJot = jwt.decode(res.locals.id_token, { complete: true });
      logger.log("********* getUserInfo: decodedJot:");
      logger.log(decodedJot);
      res.locals.nickname = decodedJot.payload.nickname;
      res.locals.email = decodedJot.payload.email;
      res.locals.sub = decodedJot.payload.sub;
      res.locals["cognito:username"] = decodedJot.payload["cognito:username"];
    } catch (err) {
      logger.log(
        "getUserInfo: unable to get nickname/email/sub/" + "cognito:username"
      );
      logger.log(err);
      return res.sendStatus(500);
    }
    if (
      !res.locals.nickname ||
      !res.locals.email ||
      !res.locals.sub ||
      !res.locals["cognito:username"]
    ) {
      logger.log(
        "getUserInfo: invalid nickname, email, sub, or " + "cognito:username:"
      );
      logger.log(res.locals.nickname);
      logger.log(res.locals.email);
      logger.log(res.locals.sub);
      logger.log(res.locals["cognito:username"]);
      return res.sendStatus(500);
    }
    return next();
  };
  return middleware;
};
module.exports = getUserInfo;
