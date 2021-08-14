const validateQueryCode = (req, res, next) => {
  const codeBlacklist = /[^-a-z0-9A-Z_]/;
  if (
    typeof req.query.code !== "string" ||
    codeBlacklist.test(req.query.code)
  ) {
    return res.sendStatus(400);
  }
  return next();
};
module.exports = validateQueryCode;
