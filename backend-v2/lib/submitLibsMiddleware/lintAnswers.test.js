/* globals expect */
describe('lib/submitAnswersMiddleware/lintAnswers', () => {
  const lintAnswers = require('./lintAnswers');
  const responses = require('../../responses');
  const runTest = ({body, expectedStatus, expectedData, expectNext}) => {
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const req = {
      body: body
    };
    const res = {
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentStatus = statusToSend; sentData = d}
        }
      },
      send: d => {sentStatus = statusToSend; sentData = d}
    };
    let nextCalled = false;
    const next = () => {nextCalled = true};
    const middleware = lintAnswers();
    middleware(req, res, next);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('non-array', () => {
    const body = {
      answers: 'not an array'
    };
    runTest({body: body, expectedData: responses.BAD_REQUEST, expectedStatus:
      400});
  });
  test('no answers property', () => {
    const body = {
      noAnswers: ['no', 'answers', 'property']
    };
    runTest({body: body, expectedData: responses.BAD_REQUEST, expectedStatus:
      400});
  });
  test('happy path 1', () => {
    const body = {
      answers: [
        {id: 1, answer: 'answer provided'},
        {id: 4}
      ]
    };
    runTest({body: body, expectNext: true});
  });
  test('happy path 2, no answers in answers', () => {
    const body = {
      answers: [
        {id: 14},
        {id: 54},
        {id: 8}
      ]
    };
    runTest({body: body, expectNext: true});
  });
  test('missing id property in an answer', () => {
    const body = {
      answers: [
        {id: 14},
        {answer: 'here is an answer with no id'},
        {id: 8, answer: 'fine'}
      ]
    };
    runTest({body: body, expectedStatus: 400, expectedData:
      responses.BAD_REQUEST});
  });
  test('non-numeric id', () => {
    const body = {
      answers: [
        {id: 14},
        {answer: 'here is an answer with a non-numeric id', id: 'nan'},
        {id: 8, answer: 'fine'}
      ]
    };
    runTest({body: body, expectedStatus: 400, expectedData:
      responses.BAD_REQUEST});
  });
});