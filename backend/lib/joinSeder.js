/**
 * @param {Function} awsSdk An object with a DynamoDB.DocumentClient() function
 * that returns an object with implementations of the AWS SDK DocumentClient's
 * createSet and update functions.
 * @param {Date} now A Date representing the moment this function is called
 * @param {Function} configs An object with msToJoinSeder() and
 * cookieValueLength(), probably ../Configs.js
 * @param {Function*} randomStringGenerator A Generator that yields at least
 * one random string of customizable length, that matches the interface of
 * ./roomCodeGenerator.js ({letters: <NUMBER>} -> <STRING>)
 * @return {Function} an Express handler that responds 200 when the request post
 * body has roomCode set to an existing Room Code, and gameName set to an
 * available name for that code; responds 400 otherwise.
 */
function joinSeder(awsSdk, now, configs, randomStringGenerator) {
  const schema = require("../schema");
  const f = async (req, res, next) => {
    if (!req || !req.body || !req.body.roomCode || !req.body.gameName) {
      res.status(400).send();
      return;
    }

    const minCreated = now.getTime() - configs.msToJoinSeder();
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const roomCode = req.body.roomCode;
    const gameName = req.body.gameName;
    const params = {
      ExpressionAttributeNames: {
        "#P": "participants",
      },
      ExpressionAttributeValues: {
        ":p": dynamodb.createSet([gameName]),
        ":mc": minCreated,
      },
      Key: {
        room_code: roomCode,
        lib_id: "000",
      },
      ReturnValues: "UPDATED_OLD", // use UPDATED_OLD, and look for the name
      // we added. If it's there, fail: the name
      // was taken. If it's not, we need to update
      // the table with this name's session key
      TableName: schema.TABLE_NAME,
      UpdateExpression: "ADD #P :p",
      ConditionExpression:
        "attribute_exists(room_code) AND attribute_exists(created) AND " +
        "created > :mc",
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          resolve({ madliberation_error: err });
        } else {
          resolve(data);
        }
      });
    });
    if (dbResponse.madliberation_error) {
      return res.status(400).send();
    }

    // get the cookie ready
    const cookieOptions =
      process.env.NODE_ENV === "development"
        ? {
            httpOnly: true,
            sameSite: "None",
          }
        : {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
          };
    const g = randomStringGenerator({ letters: configs.cookieValueLength() });
    const cookie = {
      name: req.body.gameName,
      value: g.next().value,
      options: cookieOptions,
    };

    // Now inspect the returned list of people who were at the seder already
    // and 400 if the person we just added was among them
    if (
      !dbResponse ||
      !dbResponse.Attributes ||
      !dbResponse.Attributes.participants ||
      !dbResponse.Attributes.participants.values ||
      !Array.isArray(dbResponse.Attributes.participants.values)
    ) {
      res.cookie(cookie.name, cookie.value, cookie.options);
      return next(); // response is empty for 1st participant added
    }

    const incumbents = dbResponse.Attributes.participants.values;
    incumbents.map((incumbent) => {
      if (gameName == incumbent) {
        return res.status(400).send({ error: "name taken" });
      }
    });

    res.cookie(cookie.name, cookie.value, cookie.options);
    res.cookie(
      configs.gameNameCookiePrefix() + cookie.name,
      cookie.value,
      cookie.options
    );
    return next();
  };
  return f;
}
module.exports = joinSeder;
