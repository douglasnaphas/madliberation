const defaultScript = require("./defaultScript");
describe("lib/defaultScript.parse", () => {
  const testParse = ({ input, expected }) => {
    expect(defaultScript.parse(input)).toEqual(expected);
  };
  test("figure out how to strip text before the first page", () => {
    const stripPrePage = (text) => {
      const prefix = text.split(/#{{ *Page *}}/)[0];
      const suffix = text.replace(/^.* (?=#)/, "");
      return [prefix, suffix];
    };
    expect(stripPrePage("hi")).toEqual(["hi", "hi"]);
    expect(stripPrePage("hi #{{Page}}")).toEqual(["hi ", "#{{Page}}"]);
    expect(stripPrePage("hello #{{Page}}")).toEqual(["hello ", "#{{Page}}"]);
    expect({ ab: { cd: "ef" } }).toEqual({ ab: { cd: "ef" } });
    expect([1, 2]).toEqual([1, 2]);
    expect(stripPrePage("hello #{{Page}} \n\n# a header\nsome text")).toEqual([
      "hello ",
      "#{{Page}} \n\n# a header\nsome text",
    ]);
    expect(stripPrePage("#{{Page}} \n\n# a header\nsome text")).toEqual([
      "",
      "#{{Page}} \n\n# a header\nsome text",
    ]);
  });
  test("page, h1, no libs", () => {
    const input = "# {{Page}}\n\n# The simplest possible script";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "h1",
              segments: [
                {
                  type: "text",
                  text: "The simplest possible script",
                },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("some youngest player pages", () => {
    const input =
      "# {{Page}}\n\nPage 1.\n\n" +
      "# {{ Page }}\n\nPage 2.\n\n" +
      "# {{ Page: To Youngest }}\n\nI am youngest.\n\n" +
      "# {{Page: From Youngest    }}\n\nThank you, youngest.\n\n" +
      "# {{Page: to youngest}}\n\nWaaaaahhh!!\n\n" +
      "# {{   page: from youngest}}\n\nSilence, youngest.\n\n" +
      "# {{page}}  \n\nFin.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Page 1.",
                },
              ],
            },
          ],
        },
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Page 2.",
                },
              ],
            },
          ],
        },
        {
          youngest: "to",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "I am youngest.",
                },
              ],
            },
          ],
        },
        {
          youngest: "from",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Thank you, youngest.",
                },
              ],
            },
          ],
        },
        {
          youngest: "to",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Waaaaahhh!!",
                },
              ],
            },
          ],
        },
        {
          youngest: "from",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Silence, youngest.",
                },
              ],
            },
          ],
        },
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Fin.",
                },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("some youngest player pages, funny page prefixes", () => {
    // the Google Docs script currently sometimes prints like ### # {{ Page }}
    // instead of # {{ Page }}, if the page break is before an h3 (page breaks
    // are often right before headings).
    const input =
      "### # {{Page}}\n\nPage 1.\n\n" +
      "## {{ Page }}\n\nPage 2.\n\n" +
      "##### {{ Page: To Youngest }}\n\nI am youngest.\n\n" +
      "# # {{Page: From Youngest    }}\n\nThank you, youngest.\n\n" +
      "## # {{Page: to youngest}}\n\nWaaaaahhh!!\n\n" +
      " ## {{   page: from youngest}}\n\nSilence, youngest.\n\n" +
      "# {{page}}  \n\nFin.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Page 1.",
                },
              ],
            },
          ],
        },
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Page 2.",
                },
              ],
            },
          ],
        },
        {
          youngest: "to",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "I am youngest.",
                },
              ],
            },
          ],
        },
        {
          youngest: "from",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Thank you, youngest.",
                },
              ],
            },
          ],
        },
        {
          youngest: "to",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Waaaaahhh!!",
                },
              ],
            },
          ],
        },
        {
          youngest: "from",
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Silence, youngest.",
                },
              ],
            },
          ],
        },
        {
          lines: [
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "Fin.",
                },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("page, h1, lib", () => {
    const input =
      "# {{Page}}\n\n# The simplest possible script, but with {{ a problem // a headache // I have _ // a bear in pursuit }}.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "h1",
              segments: [
                {
                  type: "text",
                  text: "The simplest possible script, but with ",
                },
                {
                  type: "lib",
                  prompt: "a problem",
                  id: 1,
                  answer: "a bear in pursuit",
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("one page, two lines, a lib", () => {
    const input =
      "# {{Page}}\n\n# This script has {{ a problem // a lib // I have _ // a bear in my car }}.\n\nThere is also a second line.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "h1",
              segments: [
                {
                  type: "text",
                  text: "This script has ",
                },
                {
                  type: "lib",
                  prompt: "a problem",
                  id: 1,
                  answer: "a bear in my car",
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
            {
              type: "p",
              segments: [
                { type: "text", text: "There is also a second line." },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("libs on multiple lines", () => {
    const input =
      "# {{Page}}\n\n# This script has {{ a problem // a lib // I have _ // a bear in my car }}.\n\nThe problem is that libs are on multiple {{ fracture planes // bounded contexts // Split it up by _ // lines }}.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "h1",
              segments: [
                {
                  type: "text",
                  text: "This script has ",
                },
                {
                  type: "lib",
                  prompt: "a problem",
                  id: 1,
                  answer: "a bear in my car",
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
            {
              type: "p",
              segments: [
                {
                  type: "text",
                  text: "The problem is that libs are on multiple ",
                },
                {
                  type: "lib",
                  prompt: "fracture planes",
                  id: 2,
                  answer: "lines",
                },
                { type: "text", text: "." },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("some stage directions", () => {
    const input =
      "# {{Page}}\n\n[[ This is a stage direction. No need to process libs here. ]]\n\nThere is also a second line.";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "stageDirection",
              segments: [
                {
                  type: "text",
                  text: "This is a stage direction. No need to process libs here.",
                },
              ],
            },
            {
              type: "p",
              segments: [
                { type: "text", text: "There is also a second line." },
              ],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
  test("two pages, no libs", () => {
    const input =
      "# {{Page}}\n\n# The simplest possible script\n\n# {{Page}}\n\nwith a second page";
    const expected = {
      pages: [
        {
          lines: [
            {
              type: "h1",
              segments: [
                {
                  type: "text",
                  text: "The simplest possible script",
                },
              ],
            },
          ],
        },
        {
          lines: [
            {
              type: "p",
              segments: [{ type: "text", text: "with a second page" }],
            },
          ],
        },
      ],
    };
    testParse({ input: input, expected: expected });
  });
});
describe("lib/defaultScript.parseLine", () => {
  test("# The simplest possible script", () => {
    expect(defaultScript.parseLine("# The simplest possible script")).toEqual({
      type: "h1",
      segments: [
        {
          type: "text",
          text: "The simplest possible script",
        },
      ],
    });
  });
  test("The simplest possible script", () => {
    expect(defaultScript.parseLine("The simplest possible script")).toEqual({
      type: "p",
      segments: [
        {
          type: "text",
          text: "The simplest possible script",
        },
      ],
    });
  });
  test("text line with a lib", () => {
    expect(
      defaultScript.parseLine(
        "text line with {{ a strange thing // a lib prompt // I see _ // a fumpton}}"
      )
    ).toEqual({
      type: "p",
      segments: [
        {
          type: "text",
          text: "text line with ",
        },
        {
          type: "lib",
          prompt: "a strange thing",
          id: 1,
          answer: "a fumpton",
        },
      ],
    });
  });
  test("multiple libs", () => {
    expect(
      defaultScript.parseLine(
        "a {{ b // c // d // e}} fg {{ hi // jk // lm // no }} lmnop qr"
      )
    ).toEqual({
      type: "p",
      segments: [
        { type: "text", text: "a " },
        {
          type: "lib",
          prompt: "b",
          id: 1,
          answer: "e",
        },
        {
          type: "text",
          text: " fg ",
        },
        {
          type: "lib",
          prompt: "hi",
          id: 2,
          answer: "no",
        },
        {
          text: " lmnop qr",
          type: "text",
        },
      ],
    });
  });
  test("## An h2", () => {
    expect(defaultScript.parseLine("## An h2")).toEqual({
      type: "h2",
      segments: [
        {
          type: "text",
          text: "An h2",
        },
      ],
    });
  });
  test("### An h3", () => {
    expect(defaultScript.parseLine("### An h3")).toEqual({
      type: "h3",
      segments: [
        {
          type: "text",
          text: "An h3",
        },
      ],
    });
  });
  test("#### An h4", () => {
    expect(defaultScript.parseLine("#### An h4")).toEqual({
      type: "h4",
      segments: [
        {
          type: "text",
          text: "An h4",
        },
      ],
    });
  });
  test("##### An h5", () => {
    expect(defaultScript.parseLine("##### An h5")).toEqual({
      type: "h5",
      segments: [
        {
          type: "text",
          text: "An h5",
        },
      ],
    });
  });
  test("###### An h6", () => {
    expect(defaultScript.parseLine("###### An h6")).toEqual({
      type: "h6",
      segments: [
        {
          type: "text",
          text: "An h6",
        },
      ],
    });
  });
  test("indented", () => {
    expect(defaultScript.parseLine("    a line of a poem or song")).toEqual({
      type: "indent",
      segments: [
        {
          type: "text",
          text: "a line of a poem or song",
        },
      ],
    });
  });
  test("omitted example", () => {
    expect(
      defaultScript.parseLine("a lib {{ with // // no _ // example }}")
    ).toEqual({
      type: "p",
      segments: [
        {
          type: "text",
          text: "a lib ",
        },
        {
          type: "lib",
          prompt: "with",
          id: 1,
          answer: "example",
        },
      ],
    });
  });
});
