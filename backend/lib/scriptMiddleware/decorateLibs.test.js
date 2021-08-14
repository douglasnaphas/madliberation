/* globals expect */
describe('scriptMiddleware/decorateLibs', () => {
  const responses = require('../../responses');
  const runTest = ({scriptIn, answers, scriptOut, expectNext, expectedStatus,
    expectedData}) => {
    const decorateLibs = require('./decorateLibs');
    const middleware = decorateLibs();
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    const next = () => {nextCalled = true};
    let sentData;
    const res = {
      locals: {
        script: scriptIn,
        answers: answers
      },
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentStatus = statusToSend; sentData = d}
        }
      },
      send: d => {sentStatus = statusToSend; sentData = d}
    };
    middleware(req, res, next);
    expect(res.locals.script).toEqual(scriptOut);
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
  };
  test('no script', () => {
    runTest({expectedStatus: 500, expectedData: responses.SERVER_ERROR});
  });
  test('should decorate libs 1', () => {
    const answers = [
      {id: 1, answer: 'one'},
      {id: 2, answer: 'two'},
      {id: 3, answer: 'three'},
      {id: 4, answer: 'four'},
      {id: 5, answer: 'five'}
    ];
    const scriptIn =
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
    const scriptOut =
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
              id: 1,
              "prompt": "does something disruptive",
              answer: "one"
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
              id: 2,
              "prompt": "something fast and heavy",
              answer: "two"
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
              id: 3,
              "prompt": "long thing",
              answer: "three"
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
              id: 4,
              "prompt": "verb",
              answer: "four"
            },
            { "type": "text", "text": " " },
            {
              "type": "lib",
              id: 5,
              "prompt": "adverbial phrase that rhymes with “day”",
              answer: "five"
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
    runTest({scriptIn: scriptIn, answers: answers, scriptOut: scriptOut,
      expectNext: true});
  });
  test('should decorate libs 2, non-contiguous answers', () => {});
  test('no pages array', () => {
    const scriptIn = {
      pages: 'is not an array'
    };
    const scriptOut = {
      pages: 'is not an array'
    };
    runTest({scriptIn: scriptIn, scriptOut: scriptOut, expectedStatus: 500,
      expectedData: responses.SERVER_ERROR});
  });
  test('test POC: you can remove properties by setting to undefined', () =>
    {
    const a = {p1: 'v1', p2: 'v2'};
    const b = {p1: 'v1', p2: 'v2'};
    expect(b).toEqual(a);
    a.p2 = undefined;
    const c = {p1: 'v1'};
    expect(c).toEqual(a);    
  });
});