const getUserInfo = require("./getUserInfo");

describe("getUserInfo", () => {
  test('should set the user nickname', () => {
    
  });
  test('should set the user email', () => {});
  test('should set the cognito user id', () => {
    
  });
  test.each`
  nickname | email | sub | cUn 
  ${"Mr X"} | ${"mxmy@ab.com"} | ${"20dec194-c509"} | ${"Google_101447422181098649733"}
  ${"Ha"} | ${"seef@x.x"} | ${"73dec194-c521"} | ${"Google_101447422181098649733"}
  `('all claims present, nickname $nickname, email $email, sub $sub, ' + 
    'cognito:username $cUn',
    ({nickname, email, sub, cUn}) => {
      const jwt = {
        decode: jest.fn(() => {
          return {
            payload: {
              nickname,
              email,
              sub,
              "cognito:username": cUn
            }
          }
        })
      };
      const middleware = getUserInfo(jwt);
      const req = {};
      const res = {
        locals: {id_token: {}},
        sendStatus: jest.fn()
      };
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals.nickname).toEqual(nickname);
      expect(res.locals.email).toEqual(email);
      expect(res.locals.sub).toEqual(sub);
      expect(res.locals["cognito:username"]).toEqual(cUn);
      expect(res.sendStatus).not.toHaveBeenCalled();
    });
  test.each`
  nickname | email | sub | cUn 
  ${undefined} | ${"sure@me.com"} | ${"8823ffa-ec194-c509"} | ${"Facebook_12384347422181098649733"}
  ${"Har"} | ${undefined} | ${"73dec194-c521-bb"} | ${"AWS_482347387422181098649733"}
  ${"Mlle Haiss"} | ${"surex@me.com"} | ${undefined} | ${"Facebook_12383469422181098649733"}
  ${"Has"} | ${"inskeef@xi.xi"} | ${"7ff3dec194-c521-bb"} | ${undefined}
  `('one or more claims missing, expect 500, nickname $nickname, email ' +
    '$email, sub $sub, cognito:username $cUn',
    ({nickname, email, sub, cUn}) => {
      const jwt = {
        decode: jest.fn(() => {
          return {
            payload: {
              nickname,
              email,
              sub,
              "cognito:username": cUn
            }
          }
        })
      };
      const middleware = getUserInfo(jwt);
      const req = {};
      const res = {
        locals: {id_token: {}},
        sendStatus: jest.fn()
      };
      const next = jest.fn();
      middleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.locals.nickname).toEqual(nickname);
      expect(res.locals.email).toEqual(email);
      expect(res.locals.sub).toEqual(sub);
      expect(res.locals["cognito:username"]).toEqual(cUn);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
})