const setDbParamsGetEmailFromSub = ({local, paramsName}) => {
  const schema = require("../schema");
  if(typeof paramsName !== "string") {
    throw "setDbParamsGetEmailFromSub: non-string paramsName";
  }
  const middleware = (req, res, next) => {
    if(local && !res.locals[local]) return next();
    res.locals[paramsName] = {
      ExpressionAttributeNames: {
        '#R': schema.PARTITION_KEY
      },
      ExpressionAttributeValues: {
        ':r': `${schema.PKEY_PREFIX_SUB}${schema.SEPARATOR}${res.locals[local]}`
      },
      KeyConditionExpression: '#R = :r',
      ProjectionExpression: schema.USER_EMAIL,
      TableName: schema.TABLE_NAME
    };
    return next();
  };
  return middleware;
};
module.exports = setDbParamsGetEmailFromSub;