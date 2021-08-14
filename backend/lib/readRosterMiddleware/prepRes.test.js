/* globals expect */
const prepRes = require('./prepRes');
const responses = require('../../responses');
describe('lib/readRosterMiddleware/prepRes', () => {
  const runTest = ({dbData, expectedDone, expectedNotDone, expectedStatus,
    expectedData, expectNext}) => {
      const middleware = prepRes();
      const req = {};
      let statusToSend = 200;
      let sentStatus;
      let sentData;
      let nextCalled = false;
      const next = () => {nextCalled = true};
      const res = {
        locals: {
          dbData: dbData
        },
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentData = d; sentStatus = statusToSend}
          };
        },
        send: d => {sentData = d; sentStatus = statusToSend}
      };
      middleware(req, res, next);
      if(expectedDone) {
        expect(res.locals.done).toEqual(expectedDone);
      }
      if(expectedNotDone) {
        expect(res.locals.notDone).toEqual(expectedNotDone);
      }
      if(expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
      }
      if(expectedData) {
        expect(sentData).toEqual(expectedData);
      }
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
      }
    };
  test('missing res.locals.dbData', () => {
    runTest({dbData: undefined, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('res.locals.dbData.Items not an array', () => {
    const dbData = {
      Items: 'not an array'
    };
    runTest({dbData: dbData, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('everyone done', () => {
    const dbData = {
      Items: [
        {
          game_name: 'me',
          answers: [
            {id: 3, answer: 'my answer'},
            {id: 1, answer: 'every prompt has an answer'}
          ]
        },
        {
          game_name: 'other me',
          answers: [
            {id: 2, answer: 'there are two participants'}
          ]
        }
      ]
    };
    const expectedDone = [
      'me',
      'other me'
    ];
    runTest({dbData: dbData, expectNext: true, expectedDone:
      expectedDone, expectedNotDone: []});
  });
  test('everyone not done', () => {
    const dbData = {
      Items: [
        {
          game_name: 'me'
        },
        {
          game_name: 'other me'
        }
      ]
    };
    const expectedNotDone = [
      'me',
      'other me'
    ];
    runTest({dbData: dbData, expectNext: true, expectedDone:
      [], expectedNotDone: expectedNotDone});
  });
  test('no participants', () => {
    const dbData = {
      Items: [
      ]
    };
    runTest({dbData: dbData, expectNext: true, expectedDone:
      [], expectedNotDone: []});
  });
  test('some done, some not', () => {
    const dbData = {
      Items: [
        {
          game_name: 'people who are'
        },
        {
          game_name: 'not done'
        },
        {
          game_name: 'and others',
          answers: [
            {id: 1},
            {id: 2, answer: 'who are'}
          ]
        },
        {
          game_name: 'like this person',
          answers: []
        },
        {
          game_name: 'who is',
          answers: [
            {id: 3, answer: 'most certainly done'},
            {id: 4, answer: 'note that an empty answers array counts as done'}
          ]
        }
      ]
    };
    const expectedNotDone = [
      'not done',
      'people who are'
    ];
    const expectedDone = [
      'and others',
      'like this person',
      'who is'
    ];
    runTest({dbData: dbData, expectNext: true, expectedDone:
      expectedDone, expectedNotDone: expectedNotDone});
  });
});