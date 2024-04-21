// TODO: Make this an executable test, to assert that these item types work
// with the indexes.
const schema = require("./backend-v2/schema");
const PK = schema.PARTITION_KEY;
const SK = schema.SORT_KEY;


// Items of the type found in the DynamoDB table.

// Read WS connection
const newReadWSConnection = {
  [PK]: '<room code>',
  [SK]: 'connection#<connection id>',
  "<GSI 1 PK>": ''
}