/**
 * @return middleware satisfying:
 *   pre: res.locals.id_token is set to a JWT
 *   post: res.locals contains properties nickname, email, sub, and
 *     cognito:username from the JWT claims, 500 on error
 */
const getUserInfo = (jwt) => {
  const middleware = (req, res, next) => {
    try {
      console.log("******** getUserInfo: id_token *********");
      console.log(res.locals.id_token);
      const decodedJot = jwt.decode(res.locals.id_token, { complete: true });
      console.log("********* getUserInfo: decodedJot:");
      console.log(decodedJot);
      res.locals.nickname = decodedJot.payload.nickname;
      res.locals.email = decodedJot.payload.email;
      res.locals.sub = decodedJot.payload.sub;
      res.locals["cognito:username"] = decodedJot.payload["cognito:username"];
    } catch (err) {
      console.log(
        "getUserInfo: unable to get nickname/email/sub/" + "cognito:username"
      );
      console.log(err);
      return res.sendStatus(500);
    }
    if (
      !res.locals.nickname ||
      !res.locals.email ||
      !res.locals.sub ||
      !res.locals["cognito:username"]
    ) {
      console.log(
        "getUserInfo: invalid nickname, email, sub, or " + "cognito:username:"
      );
      console.log(res.locals.nickname);
      console.log(res.locals.email);
      console.log(res.locals.sub);
      console.log(res.locals["cognito:username"]);
      return res.sendStatus(500);
    }
    return next();
  };
  return middleware;
};
module.exports = getUserInfo;
