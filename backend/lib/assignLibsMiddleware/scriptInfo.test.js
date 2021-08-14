/* globals expect */
describe('lib/assignLibsMiddleware/scriptInfo', () => {
  const scriptInfo = require('./scriptInfo');
  const responses = require('../../responses');
  const fs = require('fs');
  const runTest = ({locals, expectedScriptVersion, expectedLibs, expectNext,
    expectedStatus, expectedData}) => {
      const middleware = scriptInfo();
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      let sentData;
      let res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentStatus = statusToSend; sentData = d}
          };
        },
        send: d => {sentStatus = statusToSend; sentData = d}
      };
      let next = () => {nextCalled = true};
      middleware({}, res, next);
      if(expectedScriptVersion) {
        expect(res.locals.scriptVersion).toEqual(expectedScriptVersion);
      }
      if(expectedLibs) {
        expect(res.locals.libs).toEqual(expectedLibs);
      }
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
      }
      if(expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
      }
      if(expectedData) {
        expect(sentData).toEqual(expectedData);
      }
    };
  test('missing s3Data', () => {
    const locals = {
      s3Error: 'error, but no data'
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('no libs', () => {
    const locals = {
      s3Data: {"AcceptRanges":"bytes","LastModified":"2019-03-09T13:43:20.000Z",
      "ContentLength":174,"ETag":"\"8ce0606f8747b0e24d040ae579202342\"",
      "VersionId":"f5Nai482MZRa8gg8rvP6XmZ1kwW5e99R",
      "ContentType":"text/html; charset=utf-8","Metadata":{},"Body":{"type":
      "Buffer","data":[123,34,112,97,103,101,115,34,58,91,123,34,108,105,110,
      101,115,34,58,91,123,34,116,121,112,101,34,58,34,104,49,34,44,34,115,101,
      103,109,101,110,116,115,34,58,91,123,34,116,121,112,101,34,58,34,116,101,
      120,116,34,44,34,116,101,120,116,34,58,34,65,32,70,97,109,105,108,121,32,
      80,97,115,115,111,118,101,114,34,125,93,125,44,123,34,116,121,112,101,34,
      58,34,104,52,34,44,34,115,101,103,109,101,110,116,115,34,58,91,123,34,116,
      121,112,101,34,58,34,116,101,120,116,34,44,34,116,101,120,116,34,58,34,65,
      32,116,97,108,101,32,102,111,114,32,116,104,101,32,119,104,111,108,101,32,
      102,97,109,105,108,121,34,125,93,125,93,125,93,125,10]}}
    };
    const expectedScriptVersion = "f5Nai482MZRa8gg8rvP6XmZ1kwW5e99R";
    const expectedLibs = [];
    runTest({locals: locals, expectedScriptVersion: expectedScriptVersion,
      expectedLibs: expectedLibs});
  });
  test('some libs', () => {
    const locals = {
      s3Data: JSON.parse(fs.readFileSync(
        './resources/scriptInfo.resources.txt', 'utf8'))
    };
    const expectedScriptVersion = "lhMEdJDP1ItMXPIb2wWUjDRCtUL3.Daa";
    const expectedLibs = [
      {
        id: 1,
        prompt: 'does something disruptive',
        sentence: 'She _',
        defaultAnswer: 'leaves with the seder plate'
      },
      {
        id: 2,
        prompt: 'something fast and heavy',
        sentence: 'This is _',
        defaultAnswer: 'a damn lib'
      },
      {
        id: 3,
        prompt: 'long thing',
        sentence: 'This is a _',
        defaultAnswer: 'snake'
      },
      {
        id: 4,
        prompt: 'verb',
        sentence: 'I like to _',
        defaultAnswer: 'read him'
      },
      {
        id: 5,
        prompt: 'adverbial phrase that rhymes with “day”',
        example: 'in this way',
        sentence: 'I will smile _',
        defaultAnswer: 'every-which-a-way'
      }
    ];
    runTest({locals: locals, expectedScriptVersion: expectedScriptVersion,
      expectedLibs: expectedLibs});
  });
});