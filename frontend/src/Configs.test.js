import { Configs } from "./Configs";

describe("Configs", () => {
  describe("apiRelativeUrl", () => {
    test.each([
      {
        input: "x",
        expected: "/prod/x",
      },
      {
        input: "y",
        expected: "/prod/y",
      },
    ])("$x -> $expected", ({ input, expected }) => {
      expect(Configs.apiRelativeUrl(input)).toEqual(expected);
    });
  });
});
