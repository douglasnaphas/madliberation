const validateQueryCode = (req, res, next) => {
  const codeBlacklist = /[^-a-z0-9A-Z_]/;
  if (
    typeof req.query.code !== "string" ||
    codeBlacklist.test(req.query.code)
  ) {
    return res.status(400).send("Bad code param");
  }
  return next();
};
module.exports = validateQueryCode;
