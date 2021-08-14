/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: an Array of assignments, each like {id: N, prompt: '..',
 *     example: '..', sentence: '..'}, or an error
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the requestor
 */
async function assignmentsFailure(roomCode, gameName) {
  return {
    data: { err: 'Server error' },
    status: 500
  };
}

export { assignmentsFailure };
