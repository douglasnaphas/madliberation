const dbParams = require("./dbParams");
const awsSdk = require("aws-sdk");
const runTransactWrite = require("../runTransactWrite");
const handleQueryErrors = require("../handleQueryErrors");

/**
 * Set closed to true for this seder.
 */
const closeSederMiddleware = [
  // set db params
  dbParams(),
  // run query
  runTransactWrite(awsSdk, "closeSederDbParams"),
  // handle query errors
  handleQueryErrors(),
  // next
  (req, res, next) => {
    return next();
  },
];
module.exports = closeSederMiddleware;
