/* globals expect, jest */
describe("verifyJwt", () => {
  const verifyJwt = require("./verifyJwt");
  test("missing jwk2Pem throws", () => {
    expect.assertions(1);
    const jwt = {verify: jest.fn(), decode: jest.fn()};
    const jot = "a.signed.jot";
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "2somekid", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}
    ];
    try {
      verifyJwt({jwt, jot, jwks});
    } catch (err) {
      expect(true).toBe(true);
    }
  });
  test("missing jwt throws", () => {
    const jwk2Pem = jest.fn();
    expect.assertions(1);
    const jot = "somekinda.jotthathasbeen.signedXX";
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "2somekid", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}
    ];
    try {
      verifyJwt({jwk2Pem, jot, jwks});
    } catch (err) {
      expect(true).toBe(true);
    }
  });
  test("missing jwt.verify throws", () => {
    const jwk2Pem = jest.fn();
    expect.assertions(1);
    const jot = "just.a.jot";
    const jwt = {noverify: jest.fn(), decode: jest.fn()};
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "2somekid", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}
    ];
    try {
      verifyJwt({jwk2Pem, jwt, jot, jwks});
    } catch (err) {
      expect(err).toEqual("verifyJwt: missing jwt.verify");
    }
  });
  test("missing jwt.decode throws", () => {
    const jwk2Pem = jest.fn();
    expect.assertions(1);
    const jot = "just.a.jot";
    const jwt = {verify: jest.fn()};
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "2somekid", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}
    ];
    try {
      verifyJwt({jwk2Pem, jwt, jot, jwks});
    } catch (err) {
      expect(err).toEqual("verifyJwt: missing jwt.decode");
    }
  });
  test("missing jot throws", () => {
    const jwk2Pem = jest.fn();
    expect.assertions(1);
    const jwt = {verify: jest.fn(), decode: jest.fn()};
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "2somekid", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}
    ];
    try {
      verifyJwt({jwk2Pem, jwks, jwt});
    } catch (err) {
      expect(err).toEqual("verifyJwt: missing jot");
    }
  });
  test("missing jwks throws", () => {
    const jwk2Pem = jest.fn();
    expect.assertions(1);
    const jot = "somekinda.jotthathasbeen.signedXX";
    const jwt = {verify: jest.fn(), decode: jest.fn()};
    try {
      verifyJwt({jwk2Pem, jot, jwt});
    } catch (err) {
      expect(err).toEqual("verifyJwt: missing jwks");
    }
  });
  test("successful verification 1", () => {
    const jwkPem = "somepem1";
    const jwk2Pem = jest.fn(() => jwkPem);
    const decodedJot = {
      header: {kid: "kid1"},
      payload: {sub: "sub1"},
      signature: "sig1"
    };
    const jot = "some.jot.1";
    const jwt = {
      verify: jest.fn(() => decodedJot.payload),
      decode: jest.fn(() => decodedJot)
    };
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "kid1", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}      
    ];
    expect(() => {verifyJwt({jwk2Pem, jwt, jot, jwks})}).not.toThrow();
    expect(jwt.decode).toHaveBeenCalled
    expect(jwt.decode).toHaveBeenCalledWith(jot, {complete: true});
    expect(jwk2Pem).toHaveBeenCalledWith(jwks[1]);
  });
  test("successful verification 2", () => {
    const jwkPem = "somepem1";
    const jwk2Pem = jest.fn(() => jwkPem);
    const decodedJot = {
      header: {kid: "kid2"},
      payload: {sub: "sub2"},
      signature: "sig2"
    };
    const jot = "some2.jot2.2";
    const jwt = {
      verify: jest.fn(() => decodedJot.payload),
      decode: jest.fn(() => decodedJot)
    };
    const jwks = [
      {alg: "anal22g", e: "2somee2222", kid: "kid2", kty: "2ay2", n: "two",
        use: "2ause2x", sig: "2xxXX"}      
    ];
    const sub = verifyJwt({jwk2Pem, jwt, jot, jwks});
    expect(jwt.decode).toHaveBeenCalled
    expect(jwt.decode).toHaveBeenCalledWith(jot, {complete: true});
    expect(jwk2Pem).toHaveBeenCalledWith(jwks[0]);
    expect(sub).toEqual(decodedJot.payload.sub);
    expect(jwt.verify).toHaveBeenCalledWith(jot, jwkPem, {algorithm: "RS256"});
  });
  test("verification fails", () => {
    const jwkPem = "somePEMVerificationFails";
    const jwk2Pem = jest.fn(() => jwkPem);
    const jot = "some.jot.bad";
    const decodedJot = {
      header: {kid: "kid1"},
      payload: "pl1",
      signature: "sig1"
    };
    const jwt = {
      verify: jest.fn(() => {throw "Error verifying jot"}),
      decode: jest.fn(() => decodedJot)
    };
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "kid1", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}      
    ];
    expect(() => {verifyJwt({jwk2Pem, jwt, jot, jwks})}).toThrow();
  });
  test("decoding fails", () => {
    const jwkPem = "somePEMDecodingFails";
    const jwk2Pem = jest.fn(() => jwkPem);
    const jot = "some.jot.cantbedecoded";
    const jwt = {
      verify: jest.fn(),
      decode: jest.fn(() => {throw "Error decoding jot"})
    };
    const jwks = [
      {alg: "analg", e: "somee", kid: "somekid", kty: "akty", n: "3f",
        use: "ause", sig: "xx"},
      {alg: "analg", e: "2somee", kid: "kid1", kty: "2akty", n: "3f2",
        use: "2ause", sig: "2xx"}      
    ];
    expect(() => {verifyJwt({jwk2Pem, jwt, jot, jwks})}).toThrow();
  });
});