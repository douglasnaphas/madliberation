const flagAuthedRequests = require("./flagAuthedRequests");
const pullTokensFromCookies = require("./pullTokensFromCookies");
const getJwksConditionally = require("./getJwksConditionally");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const awsSdk = require("aws-sdk");
const setDbParamsGetEmailFromSub = require("./setDbParamsGetEmailFromSub");
const runQuery = require("./runQuery");
const validateOpaqueCookie = require("./validateOpaqueCookie");

const authenticate = [
  // saved in res.locals:
  // get the preAuthEmail from the various places it could be (req.query.email,
  // req.body.email for POSTs), decode it from URI encoding, and save it in
  // res.locals.preAuthEmail
  flagAuthedRequests(),
  ///////// below here only happens if this is an authenticated request ////////
  ///////// but middlewares have to enforce that rule individually /////////////
  ////////// by looking for res.locals.preAuthEmail ////////////////////////////

  validateOpaqueCookie({ local: "preAuthEmail" }),

  // dbParamsGetEmailFromOpaqueCookie
  

  // runQuery

  // fail if error

  // compare email to req.email

  // set res.locals.userEmail

  //////////////////////////////////////////////////////////////////////////////
  // the end goal of this whole series is to populate res.locals.userEmail    //
  // on successful authentication                                             //
  //////////////////////////////////////////////////////////////////////////////
];
module.exports = authenticate;
