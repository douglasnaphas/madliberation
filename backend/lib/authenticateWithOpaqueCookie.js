const flagAuthedRequests = require("./flagAuthedRequests");
const validateOpaqueCookie = require("./validateOpaqueCookie");
const runGet = require("./runGet");
const logger = require("../logger");
const schema = require("../schema");
const dbParamsGetEmailFromOpaqueCookie = require("./dbParamsGetEmailFromOpaqueCookie")

const authenticate = [
  // get the preAuthEmail from the various places it could be (req.query.email,
  // req.body.email for POSTs), decode it from URI encoding, and save it in
  // res.locals.preAuthEmail
  flagAuthedRequests(), // preAuthEmail
  ///////// below here only happens if this is an authenticated request ////////
  ///////// but middlewares have to enforce that rule individually /////////////
  ////////// by looking for res.locals.preAuthEmail ////////////////////////////
  validateOpaqueCookie({ local: "preAuthEmail" }), // loginCookie
  dbParamsGetEmailFromOpaqueCookie("preAuthEmail"), // dbParamsGetEmailFromOpaqueCookie
  runGet("preAuthEmail"), // dbError, dbData
  // fail if error
  (req, res, next) => {
    if (res.locals.dbError) {
      logger.log("dbError getting email from opaque cookie");
      logger.log(dbError);
      return res.sendStatus(500);
    }
    return next();
  },
  // compare email to res.locals.preAuthEmail
  // set res.locals.userEmail
  (req, res, next) => {
    if (!res.locals.preAuthEmail) {
      return next();
    }
    if (
      !res.locals.dbData ||
      !res.locals.dbData.Item ||
      !res.locals.dbData.Item[schema.USER_EMAIL]
    ) {
      logger.log(
        `email not found in db for user claiming to be ${res.locals.preAuthEmail}`
      );
      return res.sendStatus(400);
    }
    const dbEmail = res.locals.dbData.Item[schema.USER_EMAIL];
    if (res.locals.preAuthEmail !== dbEmail) {
      logger.log(
        `user claimed to be ${res.locals.preAuthEmail},` +
          ` cookie said ${dbEmail}`
      );
      return res.sendStatus(400);
    }
    res.locals.userEmail = dbEmail;
  }, // userEmail

  //////////////////////////////////////////////////////////////////////////////
  // the end goal of this whole series is to populate res.locals.userEmail    //
  // on successful authentication                                             //
  //////////////////////////////////////////////////////////////////////////////
];
module.exports = authenticate;
