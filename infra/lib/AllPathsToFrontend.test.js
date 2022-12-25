const fs = require("fs");
const code =
  fs.readFileSync("./lib/AllPathsToFrontend.js").toString() +
  `\nmodule.exports=handler;`;
const requireFromString = require("require-from-string");
const handler = requireFromString(code);
describe("AllPathsToFrontend", () => {
  test.each([
    {
      uri: "/",
      expected: "/",
    },
  ])("$uri -> $expected", ({ uri, expected }) => {
    expect(handler({ request: { uri } }).uri).toEqual(`${expected}`);
  });
});
