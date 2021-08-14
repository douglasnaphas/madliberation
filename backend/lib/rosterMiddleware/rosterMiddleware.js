const checkParams = require('./checkParams');
const dbParams = require('./dbParams');
const runQuery = require('../runQuery');
const awsSdk = require('aws-sdk');
const handleQueryErrors = require('../handleQueryErrors');
const sortParticipants = require('./sortParticipants');

/**
 * Return a sorted JSON array of the Game Names of participants in this seder.
 * Send 400 with "bad request" if the seder identified by the roomcode in the
 * query params does not exist.
 */
const rosterMiddleware = [
  // check params
  checkParams(),
  // set db params
  dbParams(),
  // run query
  runQuery(awsSdk, 'rosterDbParams'),
  // handle errors from the query
  handleQueryErrors(),
  // sort the participants
  sortParticipants(),
  // success, send res.locals.participants
  (req, res) => {res.send({participants: res.locals.participants})}
];

module.exports = rosterMiddleware;