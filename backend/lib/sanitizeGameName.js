/**
 * @param {Object} options, including:
 *   - {Array} illegalCharacters An array of characters to be stripped from
 *     gameName
 * @return {Function} Express middleware that strips illegal characters out of
 * req.body.gameName
 */
function sanitizeGameName({illegalCharacters}) {
  const middelware = async (req, res, next) => {
    req.body.gameName = illegalCharacters.reduce(
      (sanitizedName, char) => {
        if(char.length < 1) return sanitizedName;
        const re = new RegExp(`[${char}]`, ['g']);
        return sanitizedName.replace(re, '');
      },
      req.body.gameName
    );
    return next();
  };
  return middelware;
}

module.exports = sanitizeGameName;