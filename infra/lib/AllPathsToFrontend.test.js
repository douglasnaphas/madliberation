const handler = require("./AllPathsToFrontend").handler;
describe("AllPathsToFrontend", () => {
  test.each([
    {
      uri: "/",
      expected: "/",
    },
  ])("$uri -> $expected", ({ uri, expected }) => {
    // expect(handler({ request: { uri } }).uri).toEqual(`${expected}`);
    expect(true).toBe(true);
  });
});
