const bodyParser = require("body-parser");
var express = require("express");
var Configs = require("./Configs");
var app = express();
var cookieParser = require("cookie-parser");
const AWS = require("aws-sdk");

const pathCheck = require("./lib/pathCheck");
const roomCode = require("./lib/room-code");
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

app.get("/login", login);

app.use(function (req, res, next) {
  res.set({
    "Content-Type": "application/json",
  });
  next();
});

app.get("/logout", (req, res) => {
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

app.get("/scripts", async function (req, res) {
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

app.use(cookieParser());

app.get("/", function (req, res) {
  res.send({
    Output: "Hello World!! ",
  });
});

app.post("/", function (req, res) {
  res.send({
    Output: "Hello World!! ",
  });
});

app.get("/public-endpoint", function (req, res) {
  res.send({
    Output: "this endpoint is public",
  });
});

app.get("/get-cookies", getLoginCookies);

app.use(bodyParser.json());

app.use(authenticate);

app.get("/playground", function (req, res, next) {
  let authHeader;
  authHeader = req.get("authorization");
  authHeader = authHeader || "no auth header";
  res.send({ Authorization: authHeader });
});

app.use(blacklistPostParams);

app.post("/rejoin", rejoin);

app.use("/room-code", pathCheck());
app.post("/room-code", roomCode(AWS, randomStringGenerator, Configs));

const joinSederMiddleware = require("./lib/joinSederMiddleware/joinSederMiddleware.js");
app.post("/join-seder", joinSederMiddleware);

const rosterMiddleware = require("./lib/rosterMiddleware/rosterMiddleware.js");
app.get("/roster", gameNameCookieCheckMidWare, rosterMiddleware);

const closeSederMiddleware = require("./lib/closeSederMiddleware/closeSederMiddleware.js");
app.post(
  "/close-seder",
  gameNameCookieCheckMidWare,
  closeSederMiddleware,
  assignLibsMiddleware,
  (req, res) => {
    res.send(responses.success());
  }
);

app.get("/assignments", gameNameCookieCheckMidWare, assignmentsMiddleware);

app.post(
  "/submit-libs",
  gameNameCookieCheckMidWare,
  submitLibsMiddleware,
  (req, res, next) => {
    return res.send({ result: "ok" });
  }
);

app.get(
  "/read-roster",
  gameNameCookieCheckMidWare,
  readRosterMiddleware,
  (req, res) => {
    res.send({ done: res.locals.done, notDone: res.locals.notDone });
  }
);

app.get("/script", gameNameCookieCheckMidWare, scriptMiddleware, (req, res) => {
  res.send(res.locals.script);
});

app.post("/play", readRosterMiddleware, (req, res) => {
  res.send({ err: res.locals.dbError, data: res.locals.dbData });
});
app.get("/play", scriptMiddleware, (req, res) => {
  res.send(res.locals.script);
});

app.post("/seders", seders);
app.get("/seders", seders);
app.get("/seders-started", seders);
app.get("/seders-joined", sedersJoined);

app.use(send500OnError);

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
