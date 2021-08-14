/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: an object containing:
 *     done: alphabetized Array of String Game Names of participants who have
 *       submitted their answers
 *     notDone: alphabetized Array of String Game Names of participatns who
 *       have not submitted their answers
 *   err: the error if any, or null
 * @param {String} roomCode The Room Code of the seder
 */
async function readRosterDone(roomCode) {
  return {
    data: {
      done: ['abba', 'babba', 'cabs'],
      notDone: []
    },
    status: 200
  };
}

export { readRosterDone };
