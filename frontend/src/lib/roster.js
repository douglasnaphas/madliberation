import { Configs } from "../Configs";

/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   gameNames: alphabetized Array of String Game Names
 *   err: the error if any, or null
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the requestor
 */
async function roster(roomCode, gameName) {
  const rosterUrl = new URL(
    `./roster?roomcode=${roomCode}&gamename=${encodeURI(gameName)}`,
    Configs.apiUrl()
  );
  if (!roomCode || !gameName) return {};
  const response = await fetch(rosterUrl, {
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

export { roster };
