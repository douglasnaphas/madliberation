/* globals expect */
const s3Params = require("./s3Params");
const bucket = require("../../bucket");
const responses = require("../../responses");
const api = require("../../api");
describe("lib/scriptMiddleware/s3Params", () => {
  const runTest = ({
    path,
    version,
    expectedS3Params,
    expectedStatus,
    expectNext,
    expectedData,
  }) => {
    const middleware = s3Params();
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const res = {
      locals: {
        path: path,
        version: version,
      },
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {
            sentStatus = statusToSend;
            sentData = d;
          },
        };
      },
      send: (d) => {
        sentStatus = statusToSend;
        sentData = d;
      },
    };
    const next = () => {
      nextCalled = true;
    };
    const req = {};
    middleware(req, res, next);
    if (expectedS3Params) {
      expect(res.locals.scriptS3Params).toEqual(expectedS3Params);
    }
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if (expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if (expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test("happy path 1", () => {
    const path = "madliberation-scripts/001-Family_Script";
    const version = "some version";
    const expectedS3Params = {
      Bucket: bucket.Bucket(path),
      Key: bucket.path2key(path),
      ResponseContentType: "text/html; charset=utf-8",
      VersionId: version,
    };
    runTest({
      path: path,
      version: version,
      expectNext: true,
      expectedS3Params: expectedS3Params,
    });
  });
  test("happy path 2", () => {
    const path = "madliberation-scripts/002-Dirty_Script";
    const version = "different version";
    const expectedS3Params = {
      Bucket: bucket.Bucket(path),
      Key: bucket.path2key(path),
      ResponseContentType: "text/html; charset=utf-8",
      VersionId: version,
    };
    runTest({
      path: path,
      version: version,
      expectNext: true,
      expectedS3Params: expectedS3Params,
    });
  });
  test("missing path", () => {
    const version = "aversion";
    runTest({
      version: version,
      expectedStatus: 500,
      expectedData: responses.SERVER_ERROR,
    });
  });
  test("missing version", () => {
    const path = "apathy";
    runTest({
      path: path,
      expectedStatus: 500,
      expectedData: responses.SERVER_ERROR,
    });
  });
});
