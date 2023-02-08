/* globals expect */
describe('lib/assignLibsMiddleware/participants', () => {
  const participants = require('./participants');
  const responses = require('../../responses');
  const runTest = ({locals, expectedParticipants, expectNext,
    expectedStatus, expectedData}) => {
      const middleware = participants();
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      let sentData;
      let res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentStatus = statusToSend; sentData = d}
          };
        },
        send: d => {sentStatus = statusToSend; sentData = d}
      };
      let next = () => {nextCalled = true};
      middleware({}, res, next);
      if(expectedParticipants) {
        expect(res.locals.participants).toEqual(expectedParticipants);
      }
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
  test('missing s3Data', () => {
    const locals = {
      dbError: 'error, but no data'
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('dbData, but no dbData.Items', () => {
    const locals = {
      dbData: 'no Items'
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('dbData.Items not an arry', () => {
    const locals = {
      dbData: {Items: 'not an array'}
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('some participants', () => {
    const locals = {
      dbData: {
        Items: [
          {lib_id: 'participant#abc'},
          {lib_id: 'participant#def'},
          {lib_id: 'participant#123456abcdef'}
        ]
      }
    };
    const expectedParticipants = locals.dbData.Items;
    runTest({locals: locals, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
  test('some other participants', () => {
    const locals = {
      dbData: {
        Items: [
          {lib_id: 'participant#abcxyz'},
          {lib_id: 'ANOTHERparticipant#def'},
          {lib_id: 'participant#0987123456abcdef'}
        ]
      }
    };
    const expectedParticipants = locals.dbData.Items;
    runTest({locals: locals, expectNext: true, expectedParticipants:
      expectedParticipants});
  });
});