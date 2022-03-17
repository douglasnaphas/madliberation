describe("getPostLoginURI", () => {
  const getPostLoginURI = require("./getPostLoginURI");
  test.each`
    nickname           | email                      | expected
    ${"ab"}            | ${"cd@e.com"}              | ${"/?nickname=ab&email=cd%40e.com#/logging-in"}
    ${"Mr X"}          | ${"you@me.com"}            | ${"/?nickname=Mr%20X&email=you%40me.com#/logging-in"}
    ${"W, the Zz"}     | ${"ember@two2.com"}        | ${"/?nickname=W%2C%20the%20Zz&email=ember%40two2.com#/logging-in"}
    ${"Galmatha"}      | ${"everde@n.it"}           | ${"/?nickname=Galmatha&email=everde%40n.it#/logging-in"}
    ${"emails with"}   | ${"spa ces@spaces.xyz"}    | ${"/?nickname=emails%20with&email=spa%20ces%40spaces.xyz#/logging-in"}
    ${"ab@&$(*#@@#(*"} | ${"mg@vvv.com"}            | ${"/?nickname=ab%40%26%24(*%23%40%40%23(*&email=mg%40vvv.com#/logging-in"}
    ${"     "}         | ${"32839423@seven.com"}    | ${"/?nickname=%20%20%20%20%20&email=32839423%40seven.com#/logging-in"}
    ${"ab1"}           | ${"cd@e.com"}              | ${"/?nickname=ab1&email=cd%40e.com#/logging-in"}
    ${"ab2"}           | ${"cd@e.com"}              | ${"/?nickname=ab2&email=cd%40e.com#/logging-in"}
    ${"ab3"}           | ${"cd@e.com"}              | ${"/?nickname=ab3&email=cd%40e.com#/logging-in"}
    ${"ab-m5-2"}       | ${"cd@e.com"}              | ${"/?nickname=ab-m5-2&email=cd%40e.com#/logging-in"}
    ${"Abx"}           | ${"cd@e.com"}              | ${"/?nickname=Abx&email=cd%40e.com#/logging-in"}
    ${"ab dx d e"}     | ${"all-but-dss@ertat.ion"} | ${"/?nickname=ab%20dx%20d%20e&email=all-but-dss%40ertat.ion#/logging-in"}
    ${"abe"}           | ${"cd@e.com"}              | ${"/?nickname=abe&email=cd%40e.com#/logging-in"}
    ${"Mizz Ayaaff"}   | ${"cd@ex.com"}             | ${"/?nickname=Mizz%20Ayaaff&email=cd%40ex.com#/logging-in"}
    ${"ab2"}           | ${"cd@e.com"}              | ${"/?nickname=ab2&email=cd%40e.com#/logging-in"}
    ${"zx2"}           | ${"ce@ff.com"}             | ${"/?nickname=zx2&email=ce%40ff.com#/logging-in"}
  `("($nickname, $email) -> $expected", ({ nickname, email, expected }) => {
    const res = { locals: { nickname, email } };
    const next = jest.fn();
    const middleware = getPostLoginURI();
    middleware({}, res, next);
    expect(res.locals.postLoginURI).toEqual(expected);
    expect(next).toHaveBeenCalled();
  });
});
