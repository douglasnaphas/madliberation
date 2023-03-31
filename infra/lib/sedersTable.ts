import { aws_dynamodb as dynamodb, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
const schema = require("../../backend/schema");
const schemaV2 = require("../../backend-v2/schema");
const sedersTable: (construct: Construct) => dynamodb.Table = (
  construct: Construct
) => {
  const table = new dynamodb.Table(construct, "SedersTable", {
    partitionKey: {
      name: schema.PARTITION_KEY,
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: { name: schema.SORT_KEY, type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
    stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
  });
  table.addGlobalSecondaryIndex({
    indexName: schema.SCRIPTS_INDEX,
    partitionKey: {
      name: schema.SCRIPTS_PART_KEY,
      type: dynamodb.AttributeType.NUMBER,
    },
    nonKeyAttributes: [
      schema.HAGGADAH_DESCRIPTION,
      schema.HAGGADAH_NAME,
      schema.SORT_KEY,
      schema.PARTITION_KEY,
      schema.HAGGADAH_SHORT_DESC,
      schema.PATH,
    ],
    projectionType: dynamodb.ProjectionType.INCLUDE,
    sortKey: {
      name: schema.SCRIPT_NUMBER,
      type: dynamodb.AttributeType.NUMBER,
    },
  });
  table.addGlobalSecondaryIndex({
    indexName: schema.EMAIL_PATH_INDEX,
    partitionKey: {
      name: schema.USER_EMAIL,
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: schema.PATH,
      type: dynamodb.AttributeType.STRING,
    },
    projectionType: dynamodb.ProjectionType.ALL,
  });
  table.addGlobalSecondaryIndex({
    indexName: schema.EMAIL_GAME_NAME_INDEX,
    partitionKey: {
      name: schema.USER_EMAIL,
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: schema.GAME_NAME,
      type: dynamodb.AttributeType.STRING,
    },
    projectionType: dynamodb.ProjectionType.ALL,
  });
  table.addGlobalSecondaryIndex({
    indexName: schema.OPAQUE_COOKIE_INDEX,
    partitionKey: {
      name: schema.OPAQUE_COOKIE,
      type: dynamodb.AttributeType.STRING,
    },
    projectionType: dynamodb.ProjectionType.ALL,
  });
  table.addGlobalSecondaryIndex({
    indexName: schemaV2.LEADER_EMAIL_INDEX,
    partitionKey: {
      name: schemaV2.LEADER_EMAIL,
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: schema.TIMESTAMP,
      type: dynamodb.AttributeType.STRING,
    },
    projectionType: dynamodb.ProjectionType.ALL,
  });
  return table;
};
module.exports = sedersTable;
