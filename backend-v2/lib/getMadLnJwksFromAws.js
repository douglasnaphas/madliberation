const Configs = require("../Configs");
const responses = require("../responses");
/**
 * @param {*} axios Object providing get
 * @return middleware satisying:
 *   post: res.locals.jwks is an array of JWK objects with properties alg, e,
 *         kid, kty, n, use, and sig
 */
const getMadLnJwksFromAws = axios => {
  const middleware = async (req, res, next) => {
    await axios
      .get(Configs.jwksUrl())
      .then(r => {
        res.locals.jwks = r.data.keys;
        return next();
      })
      .catch(err => {
        console.log("getMadLnJwksFromAws: error getting JWKs from AWS");
        console.log(err);
        return res.sendStatus(500);
      });
  };
  return middleware;
};
module.exports = getMadLnJwksFromAws;
