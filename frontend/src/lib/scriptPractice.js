import { Configs } from '../Configs';

/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: the script, structured, populated with answers, for reading
 *   err: the error if any, or null
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the participant
 */
async function scriptPractice(roomCode, gameName) {
  const data = {
    pages: [
      {
        lines: [
          {
            type: 'h1',
            segments: [{ type: 'text', text: 'A Very Practice Passover' }]
          },
          {
            type: 'h4',
            segments: [
              {
                type: 'text',
                text: 'A safe space to learn how to play Mad Liberation'
              }
            ]
          },
          {
            type: 'p',
            segments: [
              { type: 'text', text: 'Come, Jew, on a Jewney of liberation.' }
            ]
          },
          {
            type: 'h2',
            segments: [{ type: 'text', text: 'The bad old days' }]
          },
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text:
                  'Have you ever been to a seder where someone says, “Stop looking at your phone”?'
              }
            ]
          },
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text:
                  'The only thing that ruins Passover quicker than that is when someone '
              },
              {
                type: 'lib',
                id: 1,
                prompt: 'does something disruptive',
                answer: 'one'
              },
              { type: 'text', text: '.' }
            ]
          },
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text: 'Here is another lib, coming at you like '
              },
              {
                type: 'lib',
                id: 2,
                prompt: 'something fast and heavy',
                answer: 'two'
              },
              { type: 'text', text: '.' }
            ]
          }
        ]
      },
      {
        lines: [
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text:
                  'Well, this is fun. It’s important for a haggadah to span multiple pages, like a textual '
              },
              {
                type: 'lib',
                id: 3,
                prompt: 'long thing',
                answer: 'three'
              },
              { type: 'text', text: '.' }
            ]
          },
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text:
                  'Some pages will have songs. Some songs will have libs, as in:'
              }
            ]
          },
          {
            type: 'indent',
            segments: [{ type: 'text', text: 'If you like' }]
          },
          {
            type: 'indent',
            segments: [{ type: 'text', text: 'Claude Monet' }]
          },
          {
            type: 'indent',
            segments: [
              { type: 'text', text: 'You can ' },
              {
                type: 'lib',
                id: 4,
                prompt: 'verb',
                answer: 'four'
              },
              { type: 'text', text: ' ' },
              {
                type: 'lib',
                id: 5,
                prompt: 'adverbial phrase that rhymes with “day”',
                answer: 'five'
              }
            ]
          },
          {
            type: 'indent',
            segments: [{ type: 'text', text: 'Seders are fine' }]
          },
          {
            type: 'indent',
            segments: [{ type: 'text', text: 'Good haggadahs have to rhyme' }]
          },
          {
            type: 'p',
            segments: [{ type: 'text', text: 'Others will not.' }]
          }
        ]
      },
      {
        lines: [
          {
            type: 'p',
            segments: [
              {
                type: 'text',
                text:
                  'Eventually, we’ll also have to handle special characters. It probably won’t be hard.'
              }
            ]
          }
        ]
      }
    ]
  };
  return {
    data: data,
    status: 200
  };
}
export { scriptPractice };
