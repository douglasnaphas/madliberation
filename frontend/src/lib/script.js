import { Configs } from "../Configs";

/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   data: the script, structured, populated with answers, for reading
 *   err: the error if any, or null
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the participant
 */
async function script(roomCode, gameName) {
  const scriptUrl = new URL(
    `./script?roomcode=${roomCode}&gamename=${encodeURI(gameName)}`,
    Configs.apiUrl()
  );
  if (!roomCode) return {};
  const response = await fetch(scriptUrl, {
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

export { script };
