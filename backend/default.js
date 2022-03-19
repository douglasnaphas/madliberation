const schema = require("./schema");

exports.handler = async function (event, context, callback) {
  console.log("default handler called");
  console.log("event:");
  console.log(event);
  console.log("context:");
  console.log(context);
  return {
    statusCode: 200,
    body: "defaulted",
  };
};
