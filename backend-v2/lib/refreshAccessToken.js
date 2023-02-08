
const refreshAccessToken = async (refreshToken, clientSecret) => {
  const axios = require("axios");
  const Configs = require("../Configs");
  const qs = require("qs");
  const logger = require("../logger");
  if(!refreshToken) {
    logger.log(`refreshAccessToken: no refreshToken provided`);
    throw "refreshAccessToken: error, no refreshToken provided";
  }
  const postData = qs.stringify({
    grant_type: "refresh_token",
    client_id: Configs.CognitoClientID(),
    refresh_token: refreshToken
  });
  const postConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ` + Buffer.from(
        `${Configs.CognitoClientID()}:${clientSecret}`
        ).toString('base64')
    }
  };
  return await axios.post(
    Configs.CognitoTokenEndpointURL(),
    postData,
    postConfig)
    .then(r => r.data);
};
module.exports = refreshAccessToken;