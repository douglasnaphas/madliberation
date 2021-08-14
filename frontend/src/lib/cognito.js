const ID_TOKEN = 'id_token';
const ACCESS_TOKEN = 'access_token';
const COGNITO = 'cognito';

/**
 * Try to sign a user in.
 *
 * If the url search or hash has an id token, it is saved in storage, and the
 * returned promise will resolve to a user with the token's key-value pairs.
 *
 * If the url search or hash has an access token, it is saved in storage.
 *
 * If storage contains 'cognito.id_token' and the url search or hash does not
 * have an id token, the returned promise will resolve to a user with the
 * token's key-value pairs.
 *
 * If neither local storage nor the url has an id token, the returned promise
 * will reject with null.
 * @param {Location} url The url to check for sign-in tokens
 * @param {Storage} storage The place to save tokens, as 'cognito.id_token'
 * and 'cognito.access_token'
 * @return {Promise} A promise that will resolve to the signed-in user, or
 * reject with null if no user is found.
 */
function signIn({ url, storage }) {
  return new Promise((resolve, reject) => {
    const query = parseURL(url);
    [ID_TOKEN, ACCESS_TOKEN].forEach(key => {
      const value = query[key];
      if (value) {
        storage.setItem(`${COGNITO}.${key}`, query[key]);
      }
    });
    const id_token = storage.getItem(`${COGNITO}.${ID_TOKEN}`);
    if (id_token) resolve(toUser(id_token));
    else {
      [ID_TOKEN, ACCESS_TOKEN].forEach(key => {
        storage.removeItem(`${COGNITO}.${key}`);
      });
      reject(null);
    }
  });
}

/**
 *
 * @param {*} url
 */
function signInGetCookies(url) {}

/**
 * @param {String} idToken A Base64-encoded JSON Web Token.
 * @return {Object} The claims in the body of idToken, or undefined if
 * idToken cannot be parsed to a user.
 */
function toUser(idToken) {
  if (!idToken) return undefined;
  if (!idToken.split) return undefined;
  const splitToken = idToken.split('.');
  if (splitToken.length < 2) return undefined;
  const body = splitToken[1];
  if (body === '') return undefined;
  if (/[^-_a-zA-Z0-9+=/]/.exec(body)) return undefined; // bad Base64
  return JSON.parse(atob(body));
}

/**
 * Parse search, or hash if search is falsy, into key-value pairs. For
 * example, parseURL({search: "?q=123&r=4"}) === {q: "123", r: "4"}.
 * @param {String} search A URL search or query string, like "?q=123&r=4"
 * @param {String} hash A URL hash string, like "#h=123&i=4"
 * @return {Object} A map from keys to values found in the search or hash, or
 * an empty object if no search or hash is present
 */
function parseURL({ search, hash }) {
  if (!(search || hash)) return {};
  return (search || hash)
    .slice(1)
    .split('&')
    .map(kv => kv.split('='))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

/**
 * Clear the access and id tokens from storage, and return a promise that
 * resolves to an empty object when this is complete.
 * @param {Storage} storage The place to clear tokens from
 */
function signOut(storage) {}

/**
 * @return {String} COGNITO.ACCESS_TOKEN from local storage
 */
function getAccessToken() {}

export {
  ID_TOKEN,
  ACCESS_TOKEN,
  COGNITO,
  signIn,
  toUser,
  parseURL,
  signOut,
  getAccessToken
};
