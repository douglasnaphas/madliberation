/* globals expect */
describe('rosterMiddleware/sortParticipants', () => {
  const sortParticipants = require('./sortParticipants');
  const responses = require('../../responses');
  const runTest = ({res, expect500, expectNext, expectedParticipants}) => {
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    let nextCalled = false;
    const next = () => {nextCalled = true};
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => {sentData = d; sentStatus = statusToSend;}
      };
    };
    res.send = (d) => {sentData = d; sentStatus = statusToSend;};
    const middleware = sortParticipants();
    middleware(req, res, next);
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedParticipants) {
      expect(res.locals.participants).toEqual(expectedParticipants);
    }
  };
  test('no res.locals.dbData, expect 500', () => {
    const res = {
      locals: {
        dbError: 'some error, but no data'
      }
    };
    runTest({res: res, expect500: true});
  });
  test('should sort participants 1', () => {
    const res = {
      locals: {
        dbData: {
          Items: [
            {game_name: 'Elan'},
            {game_name: 'Ure'},
            {game_name: 'Bylan'},
            {game_name: 'Tyro'},
            {game_name: 'Crybaby'},
            {game_name: '2 Kold'},
            {game_name: 'Bry Bry'},
            {game_name: '1 Kold'},
            {game_name: 'Bry Aly'}
          ]
        }
      }
    };
    const expectedParticipants = [
      '1 Kold',
      '2 Kold',
      'Bry Aly',
      'Bry Bry',
      'Bylan',
      'Crybaby',
      'Elan',
      'Tyro',
      'Ure'
    ];
    runTest({res: res, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('should sort participants 2', () => {
    const res = {
      locals: {
        dbData: {
          Items: [
            {game_name: 'yolavassa'},
            {game_name: 'Zyman'},
            {game_name: 'bryn athyn'},
            {game_name: 'The Code'},
            {game_name: 'the code'},
            {game_name: 'my 400'},
            {game_name: 'Zyman'},
            {game_name: 'a duplicate was found'},
            {game_name: 'Crybaby'}
          ]
        }
      }
    };
    const expectedParticipants = [
      'Crybaby',
      'The Code',
      'Zyman',
      'Zyman',
      'a duplicate was found',
      'bryn athyn',
      'my 400',
      'the code',
      'yolavassa'
    ];
    runTest({res: res, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('empty participants array', () => {
    const res = {
      locals: {
        dbData: {
          Items: []
        }
      }
    };
    const expectedParticipants = [];
    runTest({res: res, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('array with two particpants', () => {
    const res = {
      locals: {
        dbData: {
          Items: [
            {game_name: 'Simlam the Ungbadryba'},
            {game_name: 'Simlam an Ungbadryba'}
          ]
        }
      }
    };
    const expectedParticipants = [
      'Simlam an Ungbadryba',
      'Simlam the Ungbadryba'
    ];
    runTest({res: res, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('array with one participant', () => {
    const res = {
      locals: {
        dbData: {
          Items: [
            {game_name: 'Asmoranomardicadesdaniculdicar'}
          ]
        }
      }
    };
    const expectedParticipants = [
      'Asmoranomardicadesdaniculdicar'
    ];
    runTest({res: res, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('malformed dbData', () => {
    const res = {
      locals: {
        dbData: {
          moreData: {
            Items: [
              {game_name: 'Asmoranomardicadesdaniculdicar'}
            ]
          }
        }
      }
    };
    runTest({res: res, expect500: true});
  });
  test('res.locals.dbData.Items is not an array', () => {
    const res = {
      locals: {
        dbData: {
          Items: {game_name: 'Asmoranomardicadesdaniculdicar'}
        }
      }
    };
    runTest({res: res, expect500: true});
  });
});