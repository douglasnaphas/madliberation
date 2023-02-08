/* globals expect */
describe('blackListPostParams', () => {
  const blackListPostParams = require('./blacklistPostParams');
  const responses = require('../responses');
  const runTest = ({req, expect400, expectNext}) => {
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    const res = {
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {
            sentStatus = statusToSend;
            sentData = d;
          }
        }
      },
      sent: (d) => { sentStatus = statusToSend; sentData =d; }
    };
    const next = () => {nextCalled = true};
    blackListPostParams(req, res, next);
    if(expect400) {
      expect(sentStatus).toEqual(400);
      expect(sentData).toEqual(responses.BAD_REQUEST);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
  }
  test('bad room code', () => {
    const req = {
      body: {
        roomCode: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('bad game name', () => {
    const req = {
      body: {
        gameName: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('bad lib', () => {
    const req = {
      body: {
        libAnswer: 'R<script>src="alert(hacked);"</script>'
      }
    };
    runTest({req: req, expect400: true});
  });
  test('all valid characters', () => {
    const req = {
      body: {
        roomCode: 'ABCDEF',
        gameName: 'Ab-Me, the 33rd',
        libAnswer: 'Oh...so you\'re "Ab-Me the 33rd," eh?'
      }
    }
    runTest({req: req, expectNext: true});
  });
});