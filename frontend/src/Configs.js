const apiStage = `/prod`;

class Configs {
  static loginUrl() {
    return "/v2/login";
  }

  static apiRelativeUrl(resource) {
    return `${apiStage}/${resource}`;
  }

  static apiUrl() {
    return "https://" + window.location.hostname + "/prod/";
  }

  static roomCodeRegex() {
    return /^[A-Za-z]{6}$/;
  }

  static gameNameBlacklist() {
    return /[^-A-Za-z ,0-9]/g;
  }

  static libBlackList() {
    return /[^-A-Za-z ,0-9."'?!/]/g;
  }

  /**
   * The API's generic error message
   */
  static generic400ErrorMessage() {
    return "bad request";
  }

  /**
   * @return {Number} The number of milliseconds allowed to elapse before a new
   * seder cannot be joined, according to the API.
   */
  static msToJoinSeder() {
    return 1000 /* ms/s */ * 60 /* s/minute */ * 30 /* minutes */;
  }
}

export { Configs };
