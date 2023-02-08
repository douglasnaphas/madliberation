const Configs = require("../Configs");
const qs = require("querystring");

/**
 * @param {*} axios Library like axios, with post
 * @return middleware satisfying:
 *   post: res.locals.{id,access,refresh}_token is set to JWTs, 500 on error
 */
function exchangeCodeForTokens(axios, configs) {
  const middleware = async (req, res, next) => {
    console.log("******* host: ");
    console.log(req.get("host"));
    axios
      .post(
        Configs.CognitoTokenEndpointURL(),
        qs.stringify({
          grant_type: "authorization_code",
          client_id: configs.CognitoClientID(),
          code: req.query.code,
          redirect_uri: configs.CognitoRedirectURI(
            req.protocol,
            req.get("host")
          )
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                Configs.CognitoClientID() + ":" + res.locals.clientSecret
              ).toString("base64")
          }
        }
      )
      .then(response => {
        res.locals.id_token = response.data.id_token;
        res.locals.access_token = response.data.access_token;
        res.locals.refresh_token = response.data.refresh_token;
        return next();
      })
      .catch(err => {
        console.log("exchangeCodeForTokens: error getting tokens");
        console.log(err);
        return res.sendStatus(500);
      });
  };
  return middleware;
}
module.exports = exchangeCodeForTokens;
