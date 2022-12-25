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
      uri: "/seders/abcdef",
      expected: "/"
    },
    {
      uri: "/seders/abcdef/",
      expected: "/"
    },
    {
      uri: "/seders/abcdef/styles.css",
      expected: "/styles.css"
    },
    {
      uri: "/seders/ANYNUMBERANYCASE/anything.xyz",
      expected: "/anything.xyz"
    },
    {
      uri: "/not/themagicword/main.js",
      expected: "/not/themagicword/main.js"
    }
  ])("$uri -> $expected", ({ uri, expected }) => {
    expect(handler({ request: { uri } }).uri).toEqual(`${expected}`);
  });
});
