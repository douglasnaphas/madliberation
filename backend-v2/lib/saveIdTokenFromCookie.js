const saveIdTokenFromCookie = () => {
  const middleware = (req, res, next) => {
    if (!req.cookies || !req.cookies.id_token) {
      console.log("saveIdTokenFromCookie: no id token");
      console.log(req.cookies);
      return res.sendStatus(400);
    }
    res.locals.id_token = req.cookies.id_token;
    return next();
  };
  return middleware;
};
module.exports = saveIdTokenFromCookie;
