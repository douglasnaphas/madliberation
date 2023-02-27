const bodyParser = require("body-parser");
var express = require("express");
var Configs = require("./Configs");
var app = express();
var credChecker = require("./lib/credChecker");
var cookieParser = require("cookie-parser");
const AWS = require("aws-sdk");

const pathCheck = require("./lib/pathCheck");
const roomCode = require("./lib/room-code");
const roomCodeExists = require("./lib/roomCodeExists");
const randomStringGenerator = require("./lib/randomCapGenerator");
const schema = require("./schema");
const blacklistPostParams = require("./lib/blacklistPostParams");
const gameNameCookieCheckMidWare = require("./lib/gameNameCookieCheckMidWare/gameNameCookieCheckMidWare.js");
const responses = require("./responses");
const assignLibsMiddleware = require("./lib/assignLibsMiddleware/assignLibsMiddleware.js");
const assignmentsMiddleware = require("./lib/assignmentsMiddleware/assignmentsMiddleware.js");
const submitLibsMiddleware = require("./lib/submitLibsMiddleware/submitLibsMiddleware.js");
const readRosterMiddleware = require("./lib/readRosterMiddleware/readRosterMiddleware.js");
const scriptMiddleware = require("./lib/scriptMiddleware/scriptMiddleware");
const getLoginCookies = require("./lib/getLoginCookies");
const authenticate = require("./lib/authenticateWithOpaqueCookie");
const send500OnError = require("./lib/send500OnError");
const seders = require("./lib/seders");
const sedersJoined = require("./lib/sedersJoined");
const rejoin = require("./lib/rejoin");
const login = require("./lib/login/login");
const getEditLink = require("./lib/getEditLink");

const router = express.Router();

router.get("/login", login);

router.use(function (req, res, next) {
  res.set({
    "Content-Type": "application/json",
  });
  next();
});

router.get("/logout", (req, res) => {
  const expiredCookieValue = "expired-via-logout";
  res.cookie("id_token", expiredCookieValue, { expires: new Date(0) });
  res.cookie("access_token", expiredCookieValue, { expires: new Date(0) });
  res.cookie("refresh_token", expiredCookieValue, { expires: new Date(0) });
  res.cookie(Configs.loginCookieName(), expiredCookieValue, {
    expires: new Date(0),
  });
  // TODO: move this to its own file
  // TODO: invalidate the login cookie server-side
  return res.status(200).send({ message: "Logged out" });
});

router.get("/scripts", async function (req, res) {
  console.log("in /scripts 1");
  const params = {
    TableName: schema.TABLE_NAME,
    IndexName: schema.SCRIPTS_INDEX,
    ExpressionAttributeNames: {
      "#IS": schema.SCRIPTS_PART_KEY,
    },
    ExpressionAttributeValues: {
      ":is": 1,
    },
    KeyConditionExpression: "#IS = :is",
  };
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const dbResponse = await new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      resolve({ err: err, data: data });
    });
  });
  if (dbResponse.err) {
    return res.status(500).send({ err: dbResponse.err });
  }
  return res.send({ scripts: dbResponse.data });
});

router.use(cookieParser());

router.get("/", function (req, res) {
  res.send({
    Output: "This is /v2/ ... ",
  });
});

router.get("/a", function (req, res) {
  res.send({
    Output: "This is /v2/a ... ",
  });
});

router.post("/", function (req, res) {
  res.send({
    Output: "Hello World!! ",
  });
});

router.get("/public-endpoint", function (req, res) {
  res.send({
    Output: "this endpoint is public",
  });
});

router.get("/get-cookies", getLoginCookies);

router.use(bodyParser.json());

router.get("/edit-link", getEditLink);

router.use(authenticate);

router.get("/playground", function (req, res, next) {
  let authHeader;
  authHeader = req.get("authorization");
  authHeader = authHeader || "no auth header";
  res.send({ Authorization: authHeader });
});

router.use(blacklistPostParams);

router.post("/rejoin", rejoin);

router.use("/room-code", pathCheck());
router.post("/room-code", roomCode(AWS, randomStringGenerator, Configs));

const joinSederMiddleware = require("./lib/joinSederMiddleware/joinSederMiddleware.js");
router.post("/join-seder", joinSederMiddleware);

const rosterMiddleware = require("./lib/rosterMiddleware/rosterMiddleware.js");
router.get("/roster", gameNameCookieCheckMidWare, rosterMiddleware);

const closeSederMiddleware = require("./lib/closeSederMiddleware/closeSederMiddleware.js");
const getEditLink = require("./lib/getEditLink");
router.post(
  "/close-seder",
  gameNameCookieCheckMidWare,
  closeSederMiddleware,
  assignLibsMiddleware,
  (req, res) => {
    res.send(responses.success());
  }
);

router.get("/assignments", gameNameCookieCheckMidWare, assignmentsMiddleware);

router.post(
  "/submit-libs",
  gameNameCookieCheckMidWare,
  submitLibsMiddleware,
  (req, res, next) => {
    return res.send({ result: "ok" });
  }
);

router.get(
  "/read-roster",
  gameNameCookieCheckMidWare,
  readRosterMiddleware,
  (req, res) => {
    res.send({ done: res.locals.done, notDone: res.locals.notDone });
  }
);

router.get(
  "/script",
  gameNameCookieCheckMidWare,
  scriptMiddleware,
  (req, res) => {
    res.send(res.locals.script);
  }
);

router.post("/play", readRosterMiddleware, (req, res) => {
  res.send({ err: res.locals.dbError, data: res.locals.dbData });
});
router.get("/play", scriptMiddleware, (req, res) => {
  res.send(res.locals.script);
});

router.post("/seders", seders);
router.get("/seders", seders);
router.get("/seders-started", seders);
router.get("/seders-joined", sedersJoined);

router.use(send500OnError);
app.use("/v2", router);

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
