const logger = require("../logger");

/**
 * @param jot An encoded JWT
 * @param jwk2Pem Function like jwk-to-pem
 * @param jwt Library like jsonwebtoken
 * @return the sub claim from the JWT
 * 
 * Decode jot and get the signing JWK.
 * 
 * Call verify(jot, jwkPem, {algorithm: "RS256"}), where jwkPem is the signing
 * JWK.
 * 
 * Throw if jot is invalid or if any other error occurs.
 */
const verifyJwt = ({jwk2Pem, jwt, jot, jwks}) => {
  if(!jwk2Pem) {
    throw "verifyJwt: missing jwk2Pem";
  }
  if(!jwt) {
    throw "verifyJwt: missing jwt library";
  }
  if(!jwt.verify) {
    throw "verifyJwt: missing jwt.verify";
  }
  if(!jwt.decode) {
    throw "verifyJwt: missing jwt.decode";
  }
  if(!jot) {
    throw "verifyJwt: missing jot";
  }
  if(!jwks) {
    throw "verifyJwt: missing jwks";
  }
  const decodedJot = jwt.decode(jot, {complete: true});
  let jwkFound = false;
  let jwk;
  let jwkPem;
  for(let i = 0; i < jwks.length; i++) {
    if(decodedJot.header.kid === jwks[i].kid) {
      jwkFound = true;
      jwk = jwks[i];
      jwkPem = jwk2Pem(jwk);
      break;
    }
  }
  if(!jwkFound) {
    logger.log("verifyJwt: could not find jwk");
    logger.log(jwks);
    logger.log(decodedJot.header);
    throw "verifyJwt: could not find jwk";
  }
  return jwt.verify(jot, jwkPem, {algorithm: "RS256"}).sub;
};
module.exports = verifyJwt;