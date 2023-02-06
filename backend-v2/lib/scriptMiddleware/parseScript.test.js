/* globals expect */
describe('lib/parseScriptMiddleware/scriptInfo', () => {
  const parseScript = require('./parseScript');
  const responses = require('../../responses');
  const fs = require('fs');
  const runTest = ({s3Data, expectedScript, expectNext, expectedStatus,
    expectedData}) => {
      const middleware = parseScript();
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      let sentData;
      let res = {
        locals: {
          s3Data: s3Data
        },
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
      if(expectedScript) {
        expect(res.locals.script).toEqual(expectedScript);
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
    runTest({s3Data: undefined, expectedStatus: 500, expectedData:
      responses.SERVER_ERROR});
  });
  test('some libs', () => {
    const s3Data = JSON.parse(fs.readFileSync(
        './resources/scriptInfo.resources.txt', 'utf8'));
    const expectedScript =
{
  "pages": [
    {
      "lines": [
        {
          "type": "h1",
          "segments": [{ "type": "text", "text": "A Very Practice Passover" }]
        },
        {
          "type": "h4",
          "segments": [
            {
              "type": "text",
              "text": "A safe space to learn how to play Mad Liberation"
            }
          ]
        },
        {
          "type": "p",
          "segments": [
            { "type": "text", "text": "Come, Jew, on a Jewney of liberation." }
          ]
        },
        {
          "type": "h2",
          "segments": [{ "type": "text", "text": "The bad old days" }]
        },
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "Have you ever been to a seder where someone says, “Stop looking at your phone”?"
            }
          ]
        },
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "The only thing that ruins Passover quicker than that is when someone "
            },
            {
              "type": "lib",
              "prompt": "does something disruptive",
              "example": "",
              "sentence": "She _",
              "default": "leaves with the seder plate"
            },
            { "type": "text", "text": "." }
          ]
        },
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "Here is another lib, coming at you like "
            },
            {
              "type": "lib",
              "prompt": "something fast and heavy",
              "example": "",
              "sentence": "This is _",
              "default": "a damn lib"
            },
            { "type": "text", "text": "." }
          ]
        }
      ]
    },
    {
      "lines": [
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "Well, this is fun. It’s important for a haggadah to span multiple pages, like a textual "
            },
            {
              "type": "lib",
              "prompt": "long thing",
              "example": "",
              "sentence": "This is a _",
              "default": "snake"
            },
            { "type": "text", "text": "." }
          ]
        },
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "Some pages will have songs. Some songs will have libs, as in:"
            }
          ]
        },
        {
          "type": "indent",
          "segments": [{ "type": "text", "text": "If you like" }]
        },
        {
          "type": "indent",
          "segments": [{ "type": "text", "text": "Claude Monet" }]
        },
        {
          "type": "indent",
          "segments": [
            { "type": "text", "text": "You can " },
            {
              "type": "lib",
              "prompt": "verb",
              "example": "",
              "sentence": "I like to _",
              "default": "read him"
            },
            { "type": "text", "text": " " },
            {
              "type": "lib",
              "prompt": "adverbial phrase that rhymes with “day”",
              "example": "in this way",
              "sentence": "I will smile _",
              "default": "every-which-a-way"
            }
          ]
        },
        {
          "type": "indent",
          "segments": [{ "type": "text", "text": "Seders are fine" }]
        },
        {
          "type": "indent",
          "segments": [
            { "type": "text", "text": "Good haggadahs have to rhyme" }
          ]
        },
        {
          "type": "p",
          "segments": [{ "type": "text", "text": "Others will not." }]
        }
      ]
    },
    {
      "lines": [
        {
          "type": "p",
          "segments": [
            {
              "type": "text",
              "text": "Eventually, we’ll also have to handle special characters. It probably won’t be hard."
            }
          ]
        }
      ]
    }
  ]
};
    runTest({s3Data: s3Data, expectedScript: expectedScript, expectNext: true});
  });
});