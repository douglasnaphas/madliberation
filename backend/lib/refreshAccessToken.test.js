/* globals expect, jest */
describe("refreshAccessToken", () => {
  const qs = require("qs");
  const Configs = require("../Configs");
  beforeEach(() => {
    jest.resetModules();
  });
  test.skip("use axios", async () => {
    // example test, skipped
    const refreshAccessToken = require("./refreshAccessToken");
    const data = await refreshAccessToken();
    expect(data.id).toEqual(1);
  });
  test.skip("mock axios", async () => {
    // example test, skipped
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const mockGet = () => {
      return new Promise((resolve, reject) => {
        resolve({ data: { id: 2 } });
      });
    };
    axios.get.mockImplementation(() => Promise.resolve({ data: { id: 2 } }));
    const data = await refreshAccessToken();
    expect(data.id).toEqual(2);
  });
  test("should use the refresh token to get a new access token 1", async () => {
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const refreshToken = "someToken.839.fjdlak";
    const clientSecret = "fjkeia82398fasdkla";
    const mockData = {
      id_token: "abcde.fjg.hijklkm",
      access_token: "890fajldAFN.3290fjak.NMV230da8==",
      expires_in: 3600,
      token_type: "Bearer",
    };
    const authorization =
      "Basic " +
      Buffer.from(`${Configs.CognitoClientID()}:${clientSecret}`).toString(
        "base64"
      );
    axios.post.mockImplementation((url, data, config) => {
      if (url !== Configs.CognitoTokenEndpointURL()) {
        throw "wrong CognitoTokenEndpointURL";
      }
      if (!config) {
        throw "no config provided";
      }
      if (!config.headers) {
        throw "no config headers";
      }
      if (!config.headers["Content-Type"]) {
        throw "no Content-Type header";
      }
      if (
        config.headers["Content-Type"] !== "application/x-www-form-urlencoded"
      ) {
        throw (
          `Content-Type should be 'application/x-www-form-urlencoded', ` +
          `but it was ${config.headers["Content-Type"]}`
        );
      }
      if (config.headers["Authorization"] !== authorization) {
        throw (
          `wrong Authorization header, expect ${authorization}, got ` +
          `${config.headers["Authorization"]}`
        );
      }
      if (!data) {
        throw `no post body data`;
      }
      if (
        data !==
        qs.stringify({
          grant_type: "refresh_token",
          client_id: Configs.CognitoClientID(),
          refresh_token: refreshToken,
        })
      ) {
        throw `data not stringified, got ${data}`;
      }
      const parsedData = qs.parse(data);
      if (parsedData["grant_type"] !== `refresh_token`) {
        throw (
          `wrong grant_type, expect refresh_token, got ` +
          `${parsedData["grant_type"]}`
        );
      }
      if (parsedData["client_id"] !== Configs.CognitoClientID()) {
        throw (
          `wrong client_id, expect ${Configs.CognitoClientID()}, got ` +
          `${parsedData["client_id"]}`
        );
      }
      if (parsedData["refresh_token"] !== refreshToken) {
        throw (
          `wrong refresh_token, expect ${refreshToken}, got ` +
          `${parsedData["refresh_token"]}`
        );
      }
      return Promise.resolve({ data: mockData });
    });
    const receivedData = await refreshAccessToken(refreshToken, clientSecret);
    expect(receivedData.access_token).toEqual(mockData.access_token);
  });
  test("should use the refresh token to get a new access token 2", async () => {
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const refreshToken = "differetToken.FDSFJLjfdsa839.xfa8940liM";
    const clientSecret = "RUWFJALDK9fsecret2398fasdk74839439x";
    const mockData = {
      id_token: "48fjjkisabcde.fasd4ffsd.90jfdjklkm",
      access_token: "vvvjk89M2fajldAFN.3290fj4234ak.NMfasdfdV230da8==",
      expires_in: 7200,
      token_type: "Bearer",
    };
    const authorization =
      "Basic " +
      Buffer.from(`${Configs.CognitoClientID()}:${clientSecret}`).toString(
        "base64"
      );
    axios.post.mockImplementation((url, data, config) => {
      if (url !== Configs.CognitoTokenEndpointURL()) {
        throw "wrong CognitoTokenEndpointURL";
      }
      if (!config) {
        throw "no config provided";
      }
      if (!config.headers) {
        throw "no config headers";
      }
      if (!config.headers["Content-Type"]) {
        throw "no Content-Type header";
      }
      if (
        config.headers["Content-Type"] !== "application/x-www-form-urlencoded"
      ) {
        throw (
          `Content-Type should be 'application/x-www-form-urlencoded', ` +
          `but it was ${config.headers["Content-Type"]}`
        );
      }
      if (config.headers["Authorization"] !== authorization) {
        throw (
          `wrong Authorization header, expect ${authorization}, got ` +
          `${config.headers["Authorization"]}`
        );
      }
      if (!data) {
        throw `no post body data`;
      }
      if (
        data !==
        qs.stringify({
          grant_type: "refresh_token",
          client_id: Configs.CognitoClientID(),
          refresh_token: refreshToken,
        })
      ) {
        throw `data not stringified, got ${config.data}`;
      }
      const parsedData = qs.parse(data);
      if (parsedData["grant_type"] !== `refresh_token`) {
        throw (
          `wrong grant_type, expect refresh_token, got ` +
          `${parsedData["grant_type"]}`
        );
      }
      if (parsedData["client_id"] !== Configs.CognitoClientID()) {
        throw (
          `wrong client_id, expect ${Configs.CognitoClientID()}, got ` +
          `${parsedData["client_id"]}`
        );
      }
      if (parsedData["refresh_token"] !== refreshToken) {
        throw (
          `wrong refresh_token, expect ${refreshToken}, got ` +
          `${parsedData["refresh_token"]}`
        );
      }
      return Promise.resolve({ data: mockData });
    });
    const receivedData = await refreshAccessToken(refreshToken, clientSecret);
    expect(receivedData.access_token).toEqual(mockData.access_token);
  });
  test("failed post", async () => {
    expect.assertions(1);
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const refreshToken = "everthingstillright.FDSFJLjfdsa839.xfa8940liM";
    const clientSecret = "justsomeunexplainederrorhappens98fasdk748";
    const mockData = {
      id_token: "withtheapicall.fasd4ffsd.90jfdjklkm",
      access_token: "shouldbehandledN.gracefullyk.NMfasdfdV230da8==",
      expires_in: 3600,
      token_type: "Bearer",
    };
    const authorization =
      "Basic " +
      Buffer.from(`${Configs.CognitoClientID()}:${clientSecret}`).toString(
        "base64"
      );
    axios.post.mockImplementation((url, data, config) => {
      if (url !== Configs.CognitoTokenEndpointURL()) {
        throw "wrong CognitoTokenEndpointURL";
      }
      if (!config) {
        throw "no config provided";
      }
      if (!config.headers) {
        throw "no config headers";
      }
      if (!config.headers["Content-Type"]) {
        throw "no Content-Type header";
      }
      if (
        config.headers["Content-Type"] !== "application/x-www-form-urlencoded"
      ) {
        throw (
          `Content-Type should be 'application/x-www-form-urlencoded', ` +
          `but it was ${config.headers["Content-Type"]}`
        );
      }
      if (config.headers["Authorization"] !== authorization) {
        throw (
          `wrong Authorization header, expect ${authorization}, got ` +
          `${config.headers["Authorization"]}`
        );
      }
      if (!data) {
        throw `no post body data`;
      }
      if (
        data !==
        qs.stringify({
          grant_type: "refresh_token",
          client_id: Configs.CognitoClientID(),
          refresh_token: refreshToken,
        })
      ) {
        throw `data not stringified, got ${data}`;
      }
      const parsedData = qs.parse(data);
      if (parsedData["grant_type"] !== `refresh_token`) {
        throw (
          `wrong grant_type, expect refresh_token, got ` +
          `${parsedData["grant_type"]}`
        );
      }
      if (parsedData["client_id"] !== Configs.CognitoClientID()) {
        throw (
          `wrong client_id, expect ${Configs.CognitoClientID()}, got ` +
          `${parsedData["client_id"]}`
        );
      }
      if (parsedData["refresh_token"] !== refreshToken) {
        throw (
          `wrong refresh_token, expect ${refreshToken}, got ` +
          `${parsedData["refresh_token"]}`
        );
      }
      return Promise.reject("error with API call");
    });
    let receivedData;
    try {
      receivedData = await refreshAccessToken(refreshToken, clientSecret);
    } catch (err) {
      expect(receivedData).toBeUndefined();
    }
  });
});
