const nextIfNoCookies = require("./nextIfNoCookies");
/**
 * If a valid access token JWT cookie is on the request, save user
 * info to locals (Express's res.locals).
 * 
 * Pass through with nothing saved to locals otherwise.
 * 
 * Don't return 4xx/5xx on failures. Any problem that can't be recovered from
 * should result in the absence of a logged-in user in locals.
 * 
 */
const saveUserInfoToLocalsMiddleware = [
  // next() if there are no cookies
  
  // next() if there is no JWT access token in cookies
  
  // next() if JWT cannot be decoded
  
  // next() if JWT is invalid (expired case should have been handled earlier)
  // by other middleware
  
  
  // jwtFromCookieToLocals,
  // getJwksIf
  // checkJwt
  
  // save user info to locals
  
  // next()
  
];
module.exports = saveUserInfoToLocalsMiddleware;
