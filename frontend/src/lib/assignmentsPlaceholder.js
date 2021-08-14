/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: an Array of assignments, each like {id: N, prompt: '..',
 *     example: '..', sentence: '..'}, or an error
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the requestor
 */
async function assignmentsPlaceholder(roomCode, gameName) {
  return {
    data: [
      { id: 3, sentence: 'This is a _', prompt: 'long thing' },
      { id: 1, sentence: 'She _', prompt: 'does something disruptive' },
      { id: 4, sentence: 'I like to _', prompt: 'verb' },
      {
        id: 5,
        sentence: 'I will smile _',
        prompt: 'adverbial phrase that rhymes with “day”',
        example: 'in this way'
      },
      { id: 2, sentence: 'This is _', prompt: 'something fast and heavy' }
    ],
    status: 200
  };
}

export { assignmentsPlaceholder };
