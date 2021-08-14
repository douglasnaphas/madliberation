/**
 * Call storage.setItem(key, value) with key: "path#NUMBER", NUMBER a
 * timestamp from Date.now(), value: path
 * @param {*} storage An object with setItem, like localStorage
 * @param {*} path String, the path to save
 * @param {Date} date An object with a function now that returns an integer
 */
function savePath(storage, path, date) {
  storage.setItem('path#' + date.now(), path);
}
export { savePath };
