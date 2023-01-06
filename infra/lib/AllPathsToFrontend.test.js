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
    {
      uri: "/seders/seder-abcdef",
      expected: "/"
    },
    {
      uri: "/seders/seder-abcdef/",
      expected: "/"
    },
    {
      uri: "/seders/seder-abcdef/styles.css",
      expected: "/styles.css"
    },
    {
      uri: "/seders/seder-UPTOTWELVEAB/anything.xyz",
      expected: "/anything.xyz"
    },
    {
      uri: "/not/themagicword/main.js",
      expected: "/not/themagicword/main.js"
    },
    {
      uri: "/seders/static/css/main.b05db709.css",
      expected: "/static/css/main.b05db709.css"
    },
    {
      uri: "/seders",
      expected: "/"
    },
    {
      uri: "/seders/",
      expected: "/"
    }
  ])("$uri -> $expected", ({ uri, expected }) => {
    expect(handler({ request: { uri } }).uri).toEqual(`${expected}`);
  });
});
