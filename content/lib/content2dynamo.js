const AWS = require("aws-sdk");
const fs = require("fs");
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
const content2dynamo = async (tableName, scriptBucket, contentFilePath) => {
  const contentTxt = fs.readFileSync(contentFilePath, { encoding: "UTF-8" });
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const content = JSON.parse(contentTxt);
  const params = { RequestItems: {} };
  params.RequestItems[tableName] = content.Items.map((item) => {
    return {
      PutRequest: {
        Item: {
          haggadah_description: item.haggadah_description.S,
          lib_id: item.lib_id.S,
          haggadah_short_desc: item.haggadah_short_desc.S,
          room_code: item.room_code.S,
          path: `${scriptBucket}/${item.path.S}`,
          is_script: parseInt(item.is_script.N),
          haggadah_name: item.haggadah_name.S,
          script_number: parseInt(item.script_number.N),
        },
      },
    };
  });
  try {
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.batchWrite(params, (err, data) => {
        if (err) {
          reject({ madliberation_error: err });
          console.log("lib: rejected, exiting, err:");
          console.log(err);
          process.exit(1);
        } else {
          resolve(data);
        }
      });
    });
    console.log("dbResponse:");
    console.log(dbResponse);
    if (dbResponse.UnprocessedItems[tableName]) {
      console.log(
        "lib/content2dynamo: batchWriting metadata failed, dbResponse:"
      );
      console.log(dbResponse);
      throw "lib: error saving content metadata in Dynamo";
    }
    return dbResponse;
  } catch (err) {
    console.log("lib: caught error:");
    console.log(err);
    console.log("exiting");
    process.exit(1);
  }
};

module.exports = content2dynamo;
