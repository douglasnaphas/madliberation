import { Configs } from "../Configs";

/**
 * @return {Object} An object with:
 *   status: the response status, like 200,
 *   err: the error if any, or null
 * @param {String} roomCode The Room Code of the seder
 * @param {String} gameName The Game Name of the requestor
 * @param {Array} answers Array of answers like {id: NUMBER, answer: STRING},
 * answer property optional
 */
async function submitLibs(roomCode, gameName, answers) {
  const submitLibsUrl = new URL(`./submit-libs`, Configs.apiUrl());
  if (!roomCode || !gameName) return {};
  const response = await fetch(submitLibsUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomCode: roomCode,
      gameName: gameName,
      answers: answers,
    }),
  });
  const data = await response.json();
  const status = response.status;
  return {
    data: data,
    status: status,
  };
}

export { submitLibs };
