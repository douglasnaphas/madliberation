class Configs {
  static idpUrl() {
    return process.env.IDP_URL;
  }

  static jwksUrl() {
    return process.env.JWKS_URL;
  }

  static CognitoClientID() {
    return process.env.USER_POOL_CLIENT_ID;
  }

  static CognitoUserPoolID() {
    return process.env.USER_POOL_ID;
  }

  static CognitoTokenEndpointURL() {
    return (
      `https://${process.env.USER_POOL_DOMAIN}.auth.${process.env.REGION}` +
      `.amazoncognito.com/oauth2/token`
    );
  }

  static CognitoRedirectURI(protocol, host) {
    return process.env.REDIRECT_URI;
  }

  /**
   * @return {Number} The number of milliseconds allowed to elapse before a new
   * seder cannot be joined.
   */
  static msToJoinSeder() {
    return 1000 /* ms/s */ * 60 /* s/minute */ * 480 /* minutes */;
  }

  /**
   * @return {Number} The number of milliseconds allowed to elapse before a
   * seder cannot be played (no lib submissions allowed).
   */
  static msToFinishSeder() {
    return 1000 /* ms/s */ * 60 /* s/m */ * 60 /* m/h */ * 24 /* hours */;
  }

  /**
   * @return {Number} The number of letters that should be in the value of the
   * cookie sent to keep track of who has a Game Name for a Seder
   */
  static cookieValueLength() {
    return 30;
  }

  /**
   * @return {String} A prefix for the name of the cookie sent for the Game
   * Name, to ensure the cookie name does not conflict with anything
   */
  static gameNameCookiePrefix() {
    return "gamename";
  }

  static illegalGameNameCharacters() {
    return [";", "=", "(", ")"];
  }

  static roomCodePattern() {
    return /[A-Z]{6}/;
  }

  static roomCodeBlacklist() {
    return /[^A-Z]/g;
  }

  static gameNameBlacklist() {
    return /[^-A-Za-z ,0-9]/g;
  }

  static libBlacklist() {
    return /[^-A-Za-z ,0-9."'?!/]/g;
  }

  static roomCodeRetries() {
    return 10;
  }
}

module.exports = Configs;
