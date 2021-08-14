/**
 * Call storage.setItem(key, value) with key: "gameName#NUMBER", NUMBER a
 * timestamp from Date.now(), value: gameName
 * @param {*} storage An object with setItem, like localStorage
 * @param {*} gameName String, the Game Name to save
 * @param {Date} date An object with a function now that returns an integer
 */
function saveGameName(storage, gameName, date) {
  storage.setItem('gameName#' + date.now(), gameName);
}
export { saveGameName };
