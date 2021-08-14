/* globals expect, jest */
const dbParamsSaveUserTokenInfo = require('./dbParamsSaveUserTokenInfo');
const configs = require('../Configs');
const schema = require('../schema');
const responses = require('../responses');
const DbSchema = require('../DbSchema');

describe('dbParamsSaveUserTokenInfo', () => {
  const runTest = ({locals, expectedDbParams, expectNext,
    expect500, expectedStatus, expectedData}) => {
    const middleware = dbParamsSaveUserTokenInfo();
    const req = {};
    const next = jest.fn();
    const res = {locals};
    const send = jest.fn();
    res.status = jest.fn(() => {return {send}});
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.dbParamsSaveUserTokenInfo).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(next).toHaveBeenCalled();
    }
    if(expect500) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    }
    if(expectedStatus) {
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    }
    if(expectedData) {
      expect(send).toHaveBeenCalledWith(expectedData);
    }
  };
  test('happy path 1', () => {
    const locals = {
      nickname: "Mr Me",
      email: "saohan@shile.sh",
      sub: "4829382911838-fjda-23f",
      "cognito:username": "Google_3829328"
    };
    const expectedDbParams = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]: schema.PKEY_PREFIX_SUB + schema.SEPARATOR +
          locals.sub,
        [schema.SORT_KEY]: schema.USERINFO_PREFIX + schema.SEPARATOR +
          locals["cognito:username"],
        [schema.USER_NICKNAME]: locals.nickname,
        [schema.USER_EMAIL]: locals.email
      }
    };
    runTest({
      locals,
      expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const locals = {
      nickname: "dubronum",
      email: "soodoo@spa.sha",
      sub: "a3fda3jffd2911838-k4jda1-11g",
      "cognito:username": "Facebook_88593282343ikf"
    };
    const expectedDbParams = {
      TableName: schema.TABLE_NAME,
      Item: {
        [schema.PARTITION_KEY]: schema.PKEY_PREFIX_SUB + schema.SEPARATOR +
          locals.sub,
        [schema.SORT_KEY]: schema.USERINFO_PREFIX + schema.SEPARATOR +
          locals["cognito:username"],
        [schema.USER_NICKNAME]: locals.nickname,
        [schema.USER_EMAIL]: locals.email
      }
    };
    runTest({
      locals,
      expectedDbParams,
      expectNext: true
    });
  });
  test.each`
  nickname      | email               | sub                 | cUn
  ${"nick nom"} | ${"subulu@row.com"} | ${"423j-erjke-FE2"} | ${undefined}
  ${"rick rom"} | ${"tubulu@3ow.co"}  | ${undefined}        | ${"Google_124"}
  ${"the space"} | ${undefined}       | ${"kirj-erjke-d14"} | ${"Facebook_7rwe8"}
  ${undefined} | ${"FRbulu@row.com"} | ${"111-erjke-FE2"} | ${"Google_124"}
  `('missing locals property, nickname $nickname, email $email, sub $sub, ' +
    'cognito:username $cUn, expect 500', ({
      nickname, email, sub, cUn
    }) => {
      runTest({
        locals: {nickname, email, sub, "cognito:username": cUn},
        expect500: true
      })
    }
  );
});