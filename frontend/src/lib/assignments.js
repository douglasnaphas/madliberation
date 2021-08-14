import { Configs } from "../Configs";

/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: an Array of assignments, each like {id: N, prompt: '..',
 *     example: '..', sentence: '..'}, or an error
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the requestor
 */
async function assignments(roomCode, gameName) {
  const assignmentsUrl = new URL(
    `./assignments?roomcode=${roomCode}&gamename=${encodeURI(gameName)}`,
    Configs.apiUrl()
  );
  if (!roomCode || !gameName) return {};
  const response = await fetch(assignmentsUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const status = response.status;
  return {
    data: data,
    status: status,
  };
}

export { assignments };
