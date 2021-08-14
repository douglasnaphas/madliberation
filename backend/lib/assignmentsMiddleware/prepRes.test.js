/* globals expect */
const prepRes = require('./prepRes');
const responses = require('../../responses');
describe('lib/assignmentsMiddleware/prepRes', () => {
  const runTest = ({dbData, expectedAssignments, expectedStatus, expectedData,
    expectNext}) => {
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
      if(expectedAssignments) {
        expect(res.locals.assignments).toEqual(expectedAssignments);
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
  test('some assignments 1', () => {
    const dbData = {
      Items: [
        {
          assignments: [
            {id: 1, prompt: 'some prompt', sentence: 'It is _', defaultAnswer:
              'f', example: 'bad example'},
            {id: 2, prompt: 'now one', sentence: 'With no _', defaultAnswer:
              'example'}
          ]
        }
      ]
    };
    const expectedAssignments = [
      {id: 1, prompt: 'some prompt', sentence: 'It is _',
        example: 'bad example'},
      {id: 2, prompt: 'now one', sentence: 'With no _'}
    ];
    runTest({dbData: dbData, expectNext: true, expectedAssignments:
      expectedAssignments});
  });
});