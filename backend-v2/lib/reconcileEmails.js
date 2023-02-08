/**
 * @param {string} condition The name of a property of res.locals on whose
 * presence the logic of the funciton is conditioned--if local is a non-empty
 * string and res.locals.local is falsy, middleware returns next() and does
 * nothing else; otherwise middleware proceeds with the rest of its logic
 * @param {string} local1 The name of a property of res.locals that contains an
 * object like { Items: [ { user_email: 'douglasnaphas@gmail.com' } ] }
 * @param {string} local2 The name of a property of res.locals shaped like
 * local1
 * @param {string} output The name of a property of res.locals that on execution
 * to completion of the middleware will contain a user_email that was in both
 * local1.Items and local2.Items
 * @return middleware satisfying:
 *   post:
 *     - if local1.Items contains any objects where user_email equals the
 *       user_email in an element of local2.Items, res.locals[output] contains
 *       the value of user_email for one such pair of items
 *     - if the preceding condition is not true, an error is thrown
 */
const reconcileEmails = (
    condition,
    local1,
    local2,
    output
  ) => {
  const middleware = (req, res, next) => {
    if(condition && !res.locals[condition]) return next();
    if(!local1) throw 'reconcileEmails: no local1';
    if(!local2) throw 'reconcileEmails: no local2';
    if(!output) throw 'reconcileEmails: no output';
    const inputs = [local1, local2];
    for(let i = 0; i < 2; i++) {
      if(!res.locals[inputs[i]]) {
        throw {
          message: `reconcileEmails: no local${i + 1}`,
          [`local${i + 1}`]: res.locals[inputs[i]]
        }
      }
      if(!res.locals[inputs[i]]["Items"]) {
        throw {
          message: `reconcileEmails: no [local${i + 1}]["Items"]`,
          [`local${i + 1}`]: res.locals[local1]
        }
      }
      if(!Array.isArray(res.locals[inputs[i]]["Items"])) {
        throw {
          message: `reconcileEmails: non-array local${i + 1} Items`,
          Items: res.locals[inputs[i]].Items
        }
      }
    }
    const ar1 = res.locals[local1].Items.map(e => e.user_email);
    const ar2 = res.locals[local2].Items.map(e => e.user_email);
    const set1 = new Set(ar1);
    const set2 = new Set(ar2);
    function intersection(setA, setB) {
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
      let _intersection = new Set()
      for (let elem of setB) {
        if (setA.has(elem)) {
          _intersection.add(elem)
        }
      }
      return _intersection
    }
    let set1Set2Intersection = intersection(set1, set2);
    if(!set1Set2Intersection.size) {
      throw {
        message: `reconcileEmails: no matching emails`,
        locals: res.locals
      }
    }
    let arInt = Array.from(set1Set2Intersection);
    res.locals[output] = arInt[0];
    return next();
  };
  return middleware;
};
module.exports = reconcileEmails;