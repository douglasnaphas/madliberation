/**
 * Call storage.setItem(key, value) with key: "roomCode#NUMBER", NUMBER a
 * timestamp from Date.now(), value: roomCode
 * @param {*} storage An object with setItem, like localStorage
 * @param {*} roomCode String, the Room Code to save
 * @param {Date} date An object with a function now that returns an integer
 */
function saveRoomCode(storage, roomCode, date) {
  storage.setItem('roomCode#' + date.now(), roomCode);
}
export { saveRoomCode };
