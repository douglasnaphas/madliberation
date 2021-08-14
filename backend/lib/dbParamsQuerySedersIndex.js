const dbParamsQuerySedersIndex = (paramsName) => {
  const schema = require("../schema");
  if(!paramsName) throw `dbParamsQuerySedersIndex: missing paramsName`;
  const middleware = (req, res, next) => {
    res.locals[paramsName] = {
      ExpressionAttributeNames: {"#E": schema.USER_EMAIL},
      ExpressionAttributeValues: {
        ":e": res.locals.userEmail
      },
      KeyConditionExpression: "#E = :e",
      TableName: schema.TABLE_NAME,
      IndexName: 'user_email-path-TO-all-index'
    };
    return next();
  };
  return middleware;
};
module.exports = dbParamsQuerySedersIndex;