const flagAuthedRequests = require("./flagAuthedRequests");
const pullTokensFromCookies = require("./pullTokensFromCookies");
const getJwksConditionally = require("./getJwksConditionally");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const awsSdk = require("aws-sdk");
const checkJwt = require("./checkJwt");
const verifyJwt = require("./verifyJwt");
const refreshAccessToken = require("./refreshAccessToken");
const jwk2Pem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
const setDbParamsGetEmailFromSub = require("./setDbParamsGetEmailFromSub");
const runQuery = require("./runQuery");
const reconcileEmails = require("./reconcileEmails");

const authenticate = [     // saved in res.locals:
  flagAuthedRequests(),    // user (the user's sub from req.body)
  ///////// below here only happens if this is an authenticated request ////////
  ///////// but middlewares have to enforce that rule individually /////////////
  pullTokensFromCookies(), // access_token, refresh_token
  getJwksConditionally,    // jwks
  getCognitoClientSecret(  // clientSecret
    awsSdk, "user"
  ),
  checkJwt({
    jwk2Pem,
    jwt,
    tokenType: "access",
    verifyJwt,
    local: "user",
    refreshAccessToken}),  // jwt_sub
  // get email addresses from dynamo where res.locals.jwt_sub is in the part key
  setDbParamsGetEmailFromSub({
    local: "jwt_sub",
    paramsName: "jwtSubEmailQueryParams"
  }),                      // jwtSubEmailQueryParams
  runQuery(
    awsSdk,
    "jwtSubEmailQueryParams",
    "jwtEmailError",
    "jwtEmailData",
    "jwtSubEmailQueryParams"
  ),                       // jwtEmailError, jwtEmailData
  // get email addresses from dynamo where res.locals.user is in the part key
  setDbParamsGetEmailFromSub({
    local: "user",
    paramsName: "userSubEmailQueryParams"
  }),                      // userSubEmailQueryParams
  runQuery(
    awsSdk,
    "userSubEmailQueryParams",
    "userEmailError",
    "userEmailData",
    "userSubEmailQueryParams"
  ),                       // userEmailError, userEmailData  
  // make sure the email addresses match (probably will never be duplicates,
  // because subs (part of the part key) should be unique)
  // set the now thoroughly confirmed user email
  reconcileEmails(
    "user",
    "jwtEmailData",
    "userEmailData",
    "userEmail"
  )                        // userEmail
  
  //////////////////////////////////////////////////////////////////////////////
  // the end goal of this whole series is to populate res.locals.userEmail    //
  // on successful authentication                                             //
  //////////////////////////////////////////////////////////////////////////////
];
module.exports = authenticate;