const Configs = require("../Configs");

/**
 * @return middleware satisfying:
 *   post: res.locals.clientSecret is the client secret for the application's
 *         Cognito user pool client.
 *   500 on error.
 * @param {*} awsSdk AWS SDK with CognioIdentityServiceProvider (class)
 *   providing an object with a method describeUserPoolClient, like
 *   https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPoolClient-property
 */
function getCognitoClientSecret(awsSdk, local) {
  const middleware = async (req, res, next) => {
    if(local && !res.locals[local]) return next();
    const responses = require("../responses");
    const params = {
      ClientId: Configs.CognitoClientID(),
      UserPoolId: Configs.CognitoUserPoolID()
    };
    const cognitoidentityserviceprovider = new awsSdk.CognitoIdentityServiceProvider();

    const response = await new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.describeUserPoolClient(
        params,
        (err, data) => {
          resolve({ err: err, data: data });
        }
      );
    });
    const { data, err } = response;
    if (data && data.UserPoolClient && data.UserPoolClient.ClientSecret) {
      res.locals.clientSecret = data.UserPoolClient.ClientSecret;
      return next();
    }
    if (err) {
      console.log("getCognitoClientSecret: error getting client secret");
      console.log(err);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    console.log("getCognitoClientSecret: no data, no error");
    return res.status(500).send(responses.SERVER_ERROR);
  };
  return middleware;
}
module.exports = getCognitoClientSecret;
