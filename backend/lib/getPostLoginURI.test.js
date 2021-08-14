describe("getPostLoginURI", () => {
  const getPostLoginURI = require("./getPostLoginURI");
  test.each`
    nodeEnv          | protocol   | host                      | nickname           | email                      | expected
    ${"development"} | ${"http"}  | ${"localhost"}            | ${"ab"}            | ${"cd@e.com"}              | ${"http://localhost:4400?nickname=ab&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:4001"}       | ${"Mr X"}          | ${"you@me.com"}            | ${"http://localhost:4000?nickname=Mr%20X&email=you%40me.com#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:4002"}       | ${"W, the Zz"}     | ${"ember@two2.com"}        | ${"http://localhost:4001?nickname=W%2C%20the%20Zz&email=ember%40two2.com#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:3001"}       | ${"Galmatha"}      | ${"everde@n.it"}           | ${"http://localhost:3000?nickname=Galmatha&email=everde%40n.it#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:4401"}       | ${"emails with"}   | ${"spa ces@spaces.xyz"}    | ${"http://localhost:4400?nickname=emails%20with&email=spa%20ces%40spaces.xyz#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:4441"}       | ${"ab@&$(*#@@#(*"} | ${"mg@vvv.com"}            | ${"http://localhost:4440?nickname=ab%40%26%24(*%23%40%40%23(*&email=mg%40vvv.com#/logging-in"}
    ${"development"} | ${"http"}  | ${"localhost:57932"}      | ${"     "}         | ${"32839423@seven.com"}    | ${"http://localhost:57931?nickname=%20%20%20%20%20&email=32839423%40seven.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost"}            | ${"ab1"}           | ${"cd@e.com"}              | ${"https://localhost:4400?nickname=ab1&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:4001"}       | ${"ab2"}           | ${"cd@e.com"}              | ${"https://localhost:4000?nickname=ab2&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:4002"}       | ${"ab3"}           | ${"cd@e.com"}              | ${"https://localhost:4001?nickname=ab3&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:3001"}       | ${"ab-m5-2"}       | ${"cd@e.com"}              | ${"https://localhost:3000?nickname=ab-m5-2&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:4401"}       | ${"Abx"}           | ${"cd@e.com"}              | ${"https://localhost:4400?nickname=Abx&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:4441"}       | ${"ab dx d e"}     | ${"all-but-dss@ertat.ion"} | ${"https://localhost:4440?nickname=ab%20dx%20d%20e&email=all-but-dss%40ertat.ion#/logging-in"}
    ${"development"} | ${"https"} | ${"localhost:57932"}      | ${"abe"}           | ${"cd@e.com"}              | ${"https://localhost:57931?nickname=abe&email=cd%40e.com#/logging-in"}
    ${"production"}  | ${"http"}  | ${"api.passover.lol"}     | ${"Mizz Ayaaff"}   | ${"cd@ex.com"}             | ${"/?nickname=Mizz%20Ayaaff&email=cd%40ex.com#/logging-in"}
    ${"development"} | ${"http"}  | ${"api-dev.passover.lol"} | ${"ab2"}           | ${"cd@e.com"}              | ${"http://localhost:4400?nickname=ab2&email=cd%40e.com#/logging-in"}
    ${"development"} | ${"https"} | ${"api-dev.passover.lol"} | ${"zx2"}           | ${"ce@ff.com"}             | ${"http://localhost:4400?nickname=zx2&email=ce%40ff.com#/logging-in"}
  `("...", ({ nodeEnv, protocol, host, nickname, email, expected }) => {
    const req = {
      get: jest.fn((val) => {
        if (val === "host") return host;
      }),
      protocol,
    };
    const res = { locals: { nickname, email } };
    const next = jest.fn();
    const process = { env: { NODE_ENV: nodeEnv } };
    const middleware = getPostLoginURI(process);
    middleware(req, res, next);
    expect(res.locals.postLoginURI).toEqual(expected);
    expect(next).toHaveBeenCalled();

    // console.log(
    //   expected +
    //     `?nickname=${encodeURIComponent(nickname)}&email=${encodeURIComponent(
    //       email
    //     )}`
    // );
  });
});
