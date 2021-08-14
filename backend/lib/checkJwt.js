/**
 * @param {*} jwk2Pem Library like jwk-to-pem
 * @param {*} jwt Library like jsonwebtoken
 * @param {string} tokenType "id" | "access" | "refresh"
 * @param {*} local Object, name of a res.locals property whose absence means
 *   this is a non-authenticated request, and the returned middleware should
 *   call next() and do nothing else
 * @param Function refreshAccessToken A function matching lib/refreshAccessToken
 * @param Function verifyJwt A function like lib/verifyJwt
 * @return middleware satisfying:
 
 *   - if local && res.locals[local], call next() and do nothing else
 *   - check the access/id token if tokenType is access or id
 *   - get a new token if the access token is expired with the refresh token
 *   - populate res.locals.jwt_sub with the sub claim
 */
const checkJwt = ({
  jwk2Pem,
  jwt,
  tokenType,
  local,
  refreshAccessToken,
  verifyJwt
}) => {
  const logger = require("../logger");
  const middleware = async (req, res, next) => {
    try {
      if(local && !res.locals[local]) return next();
      let jot;
      if (tokenType === "id") {
        jot = res.locals.id_token;
      } else if (tokenType === "access") {
        jot = res.locals.access_token;
      } else if (tokenType === "refresh") {
        jot = res.locals.refresh_token;
      }
      if (!jot) {
        logger.log("checkJwt: invalid tokenType or jot not set");
        logger.log(tokenType);
        logger.log(jot);
        logger.log(res.locals);
        return res.sendStatus(500);
      }
      const {jwks} = res.locals;
      if(!jwks) {
        logger.log("checkJwt: no jwks");
        logger.log(jwks);
        throw "checkJwt: no jwks";
      }
      let jwtSub;
      try {
        jwtSub = verifyJwt({jwk2Pem, jwt, jot, jwks});
      } catch (err) {
        const newTokenData = await refreshAccessToken(
          res.locals.refresh_token,
          res.locals.clientSecret
        );
        const newToken = newTokenData.access_token;
        // TODO: test params on verifyJwt, should be called with the right ones
        jwtSub = verifyJwt({jwk2Pem, jwt, jot: newToken, jwks});
        const cookieOptions = {httpOnly: true};
        if(process && process.env && process.env.NODE_ENV !== "development") {
          cookieOptions.secure = true;
          console.log("checkJwt: setting same-site to strict");
          cookieOptions.sameSite = "strict";
        } else {
          console.log("checkJwt: setting same-site to None");
          cookieOptions.sameSite = "None";
        }
        if(newTokenData.id_token) {
          res.cookie("id_token", newTokenData.id_token, cookieOptions);
        }
        if(newTokenData.access_token) {
          res.cookie("access_token", newTokenData.access_token, cookieOptions);
        }
      }
      res.locals.jwt_sub = jwtSub;
      return next();
    } catch (err) {
      logger.log(`checkJwt: error`);
      logger.log(err);
      return res.sendStatus(500);
    }
  };
  return middleware;
};
module.exports = checkJwt;
