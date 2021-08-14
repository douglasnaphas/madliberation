/* globals expect */
describe('lib/assignLibsMiddleware/assignments', () => {
  const assignments = require('./assignments');
  const responses = require('../../responses');
  const lodash = require('lodash');
  const runTest = ({locals, expectedParticipants, expectNext, expectedStatus,
    expectedData}) => {
      const middleware = assignments();
      const req = {};
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      const next = () => {nextCalled = true};
      let sentData;
      const res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentData = d; sentStatus = statusToSend}
          };
        },
        send: d => {sentData = d; sentStatus = statusToSend}
      };
      middleware(req, res, next);
      if(expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
      }
      if(expectedData) {
        expect(sentData).toEqual(expectedData);
      }
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
        let minLibs = locals.libs.length + 1;
        let maxLibs = 0;
        res.locals.participants.forEach(p => {
          expect(p.libs).toBeTruthy();
          expect(Array.isArray(p.libs)).toBeTruthy();
          if(p.libs.length < minLibs) minLibs = p.libs.length;
          if(p.libs.length > maxLibs) maxLibs = p.libs.length;
        });
        expect(maxLibs - minLibs < 2).toBeTruthy();
        // expect every lib to be assigned exactly once
        res.locals.libs.forEach(lib => {
          let found = false;
          let timesLibAssigned = 0;
          res.locals.participants.forEach(participant => {
            participant.libs.forEach(participantLib => {
              if(lodash.isEqual(lib, participantLib)) {
                found = true;
                timesLibAssigned++;
              }
            });
          });
          expect(found).toBeTruthy();
          expect(timesLibAssigned).toEqual(1);
        });
      }
    };
  test('missing res.locals.libs', () => {
    const locals = {
      participants: [
        {lib_id: 'participant#abc123'}
      ]
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('missing res.locals.participants', () => {
    const locals = {
      libs: [
        {
          id: 1,
          prompt: 'does something disruptive',
          example: '',
          sentence: 'She _',
          defaultAnswer: 'leaves with the seder plate'
        },
        {
          id: 2,
          prompt: 'something fast and heavy',
          example: '',
          sentence: 'This is _',
          defaultAnswer: 'a damn lib'
        }
      ]
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('res.locals.libs not an array', () => {
    const locals = {
      participants: [
        {lib_id: 'participant#abc123'}
      ],
      libs: {not: 'an array'}
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('res.locals.participants not an array', () => {
    const locals = {
      participants: {not: 'an array'},
      libs: [
        {
          id: 1,
          prompt: 'does something disruptive',
          example: '',
          sentence: 'She _',
          defaultAnswer: 'leaves with the seder plate'
        },
        {
          id: 2,
          prompt: 'something fast and heavy',
          example: '',
          sentence: 'This is _',
          defaultAnswer: 'a damn lib'
        }
      ]
    };
    runTest({locals: locals, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('happy path 1', () => {
    const locals = {
      participants: [
        {lib_id: 'participant#abc123'},
        {lib_id: 'participant#def998'},
        {lib_id: 'participant#ghi321'}
      ],
      libs: [
        {
          id: 1,
          prompt: 'does something disruptive'
        },
        {
          id: 2,
          prompt: 'something fast and heavy'
        },
        {
          id: 3,
          prompt: 'something three'
        },
        {
          id: 4,
          prompt: 'something four'
        },
        {
          id: 5,
          prompt: 'something quite five'
        },
        {
          id: 6,
          prompt: 'something a bit more six'
        },
        {
          id: 7,
          prompt: 'something nine, you heard me nine'
        },
        {
          id: 8,
          prompt: 'codfish'
        }
      ]
    };
    runTest({locals: locals, expectNext: true});
  });
});