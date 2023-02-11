import { Stack } from "aws-cdk-lib";
import { MadLiberationWebappProps } from "./madliberation-webapp";
import { aws_cognito as cognito } from "aws-cdk-lib";
const configureSocialIDPs: (
  stack: Stack,
  props: MadLiberationWebappProps,
  userPool: cognito.UserPool
) => void = (
  stack,
  {
    facebookAppId,
    facebookAppSecret,
    amazonClientId,
    amazonClientSecret,
    googleClientId,
    googleClientSecret,
  },
  userPool
) => {
  if (facebookAppId && facebookAppSecret) {
    const userPoolIdentityProviderFacebook =
      new cognito.UserPoolIdentityProviderFacebook(stack, "Facebook", {
        clientId: facebookAppId,
        clientSecret: facebookAppSecret,
        userPool,
        scopes: ["public_profile", "email"],
        /*
        > Apps may ask for the following two permissions from any person
        > without submitting for review by Facebook:
        >
        > public profile
        > email

        https://developers.facebook.com/docs/facebook-login/overview
        */
        attributeMapping: {
          nickname: cognito.ProviderAttribute.FACEBOOK_NAME,
          email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
        },
      });
    userPool.registerIdentityProvider(userPoolIdentityProviderFacebook);
  }
  if (amazonClientId && amazonClientSecret) {
    const userPoolIdentityProviderAmazon =
      new cognito.UserPoolIdentityProviderAmazon(stack, "Amazon", {
        clientId: amazonClientId,
        clientSecret: amazonClientSecret,
        userPool,
        attributeMapping: {
          nickname: cognito.ProviderAttribute.AMAZON_NAME,
          email: cognito.ProviderAttribute.AMAZON_EMAIL,
        },
      });
    userPool.registerIdentityProvider(userPoolIdentityProviderAmazon);
  }
  if (googleClientId && googleClientSecret) {
    const userPoolIdentityProviderGoogle =
      new cognito.UserPoolIdentityProviderGoogle(stack, "Google", {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        userPool,
        scopes: ["profile", "email"],
        attributeMapping: {
          nickname: cognito.ProviderAttribute.GOOGLE_NAME,
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        },
      });
    userPool.registerIdentityProvider(userPoolIdentityProviderGoogle);
  }
};
module.exports = configureSocialIDPs;
