/* globals jest, expect */
const AWS = require("aws-sdk");
const fs = require("fs");
const mockBatchWrite = jest.fn();
const mockReadFileSync = jest.fn();

describe("content2dynamo", () => {
  beforeEach(() => {
    jest.resetModules();
    mockBatchWrite.mockReset();
    mockReadFileSync.mockReset();
  });
  test("1 haggadah", async () => {
    const tableName = "myTable";
    const bucketName = "someOtherBucket";
    const contentFilePath = "./content.json";

    mockReadFileSync.mockImplementation((path, options) => {
      if (path !== contentFilePath) return ``;
      return `{
        "Items": [
            {
                "haggadah_description": {
                    "S": "A short script to help you get good at Mad Liberation. Max 12 players."
                },
                "lib_id": {
                    "S": "script#0004"
                },
                "haggadah_short_desc": {
                    "S": "Practice Script"
                },
                "room_code": {
                    "S": "script#AAAAAD"
                },
                "path": {
                    "S": "004-Practice_Script"
                },
                "is_script": {
                    "N": "1"
                },
                "haggadah_name": {
                    "S": "0004 - Practice Script"
                },
                "script_number": {
                    "N": "4"
                }
            }
        ],
        "Count": 1,
        "ScannedCount": 1,
        "ConsumedCapacity": null
    }
    `;
    });
    jest.mock("fs", () => {
      return {
        readFileSync: mockReadFileSync,
      };
    });
    mockBatchWrite.mockImplementation((params, cb) => {
      expect(Array.isArray(params.RequestItems[tableName])).toBe(true);
      expect(params.RequestItems[tableName].length).toEqual(1);
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_description
      ).toEqual(
        "A short script to help you get good at Mad Liberation. Max 12 players."
      );
      expect(params.RequestItems[tableName][0].PutRequest.Item.lib_id).toEqual(
        "script#0004"
      );
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_short_desc
      ).toEqual("Practice Script");
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.room_code
      ).toEqual("script#AAAAAD");
      expect(params.RequestItems[tableName][0].PutRequest.Item.path).toEqual(
        `${bucketName}/004-Practice_Script`
      );
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.is_script
      ).toEqual(1);
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_name
      ).toEqual("0004 - Practice Script");
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.script_number
      ).toEqual(4);
      cb(false, { UnprocessedItems: {} });
    });
    jest.mock("aws-sdk", () => {
      return {
        config: {
          update: jest.fn(),
        },
        DynamoDB: {
          DocumentClient: jest.fn(() => {
            return {
              batchWrite: mockBatchWrite,
            };
          }),
        },
      };
    });

    const content2dynamo = require("./content2dynamo");
    const dbResponse = await content2dynamo(
      tableName,
      bucketName,
      contentFilePath
    );
    expect(dbResponse).toEqual({ UnprocessedItems: {} });
    expect(mockBatchWrite).toHaveBeenCalledTimes(1);
  });

  test("5 haggadahs", async () => {
    const tableName = "TheOtherSederTable";
    const contentFilePath = "some/path.json";
    const bucketName = "theScriptsBucketForMyApp";
    mockReadFileSync.mockImplementation((path, options) => {
      if (path === contentFilePath) {
        return `
        {
          "Items": [
              {
                  "haggadah_description": {
                      "S": "A short script to help you get good at Mad Liberation. Max 12 players."
                  },
                  "lib_id": {
                      "S": "script#0004"
                  },
                  "haggadah_short_desc": {
                      "S": "Practice Script"
                  },
                  "room_code": {
                      "S": "script#AAAAAD"
                  },
                  "path": {
                      "S": "004-Practice_Script"
                  },
                  "is_script": {
                      "N": "1"
                  },
                  "haggadah_name": {
                      "S": "0004 - Practice Script"
                  },
                  "script_number": {
                      "N": "4"
                  }
              },
              {
                  "haggadah_description": {
                      "S": "A whole Haggadah. Takes about an hour and a half."
                  },
                  "lib_id": {
                      "S": "script#006"
                  },
                  "haggadah_short_desc": {
                      "S": "Real Script"
                  },
                  "room_code": {
                      "S": "script#AAAAAF"
                  },
                  "path": {
                      "S": "006-2019_Script"
                  },
                  "is_script": {
                      "N": "1"
                  },
                  "haggadah_name": {
                      "S": "0006 - Real Script"
                  },
                  "script_number": {
                      "N": "6"
                  }
              },
              {
                  "haggadah_description": {
                      "S": "Just the part about Moses."
                  },
                  "lib_id": {
                      "S": "script#007"
                  },
                  "haggadah_short_desc": {
                      "S": "Just the Magid"
                  },
                  "room_code": {
                      "S": "script#AAAAAG"
                  },
                  "path": {
                      "S": "007-2019_Magid"
                  },
                  "is_script": {
                      "N": "1"
                  },
                  "haggadah_name": {
                      "S": "0007 - Just the Magid"
                  },
                  "script_number": {
                      "N": "7"
                  }
              },
              {
                  "haggadah_description": {
                      "S": "Just the part with the Four Sons."
                  },
                  "lib_id": {
                      "S": "script#008"
                  },
                  "haggadah_short_desc": {
                      "S": "Just the Four Sons"
                  },
                  "room_code": {
                      "S": "script#AAAAAH"
                  },
                  "path": {
                      "S": "008-2019_4_Sons"
                  },
                  "is_script": {
                      "N": "1"
                  },
                  "haggadah_name": {
                      "S": "0008 - Just the Four Sons"
                  },
                  "script_number": {
                      "N": "8"
                  }
              },
              {
                  "haggadah_description": {
                      "S": "A script tailored for video seders."
                  },
                  "lib_id": {
                      "S": "script#009"
                  },
                  "haggadah_short_desc": {
                      "S": "2020 Video Script"
                  },
                  "room_code": {
                      "S": "script#AAAAAI"
                  },
                  "path": {
                      "S": "009-2020_Video_Seder"
                  },
                  "is_script": {
                      "N": "1"
                  },
                  "haggadah_name": {
                      "S": "0009 - 2020 Video Script"
                  },
                  "script_number": {
                      "N": "9"
                  }
              }
          ],
          "Count": 5,
          "ScannedCount": 5,
          "ConsumedCapacity": null
      }
      `;
      }
    });
    jest.mock("fs", () => {
      return {
        readFileSync: mockReadFileSync,
      };
    });
    mockBatchWrite.mockImplementation((params, cb) => {
      expect(Array.isArray(params.RequestItems[tableName])).toBe(true);
      expect(params.RequestItems[tableName].length).toEqual(5);

      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_description
      ).toEqual(
        "A short script to help you get good at Mad Liberation. Max 12 players."
      );
      expect(params.RequestItems[tableName][0].PutRequest.Item.lib_id).toEqual(
        "script#0004"
      );
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_short_desc
      ).toEqual("Practice Script");
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.room_code
      ).toEqual("script#AAAAAD");
      expect(params.RequestItems[tableName][0].PutRequest.Item.path).toEqual(
        `${bucketName}/004-Practice_Script`
      );
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.is_script
      ).toEqual(1);
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.haggadah_name
      ).toEqual("0004 - Practice Script");
      expect(
        params.RequestItems[tableName][0].PutRequest.Item.script_number
      ).toEqual(4);

      expect(
        params.RequestItems[tableName][1].PutRequest.Item.haggadah_description
      ).toEqual("A whole Haggadah. Takes about an hour and a half.");
      expect(params.RequestItems[tableName][1].PutRequest.Item.lib_id).toEqual(
        "script#006"
      );
      expect(
        params.RequestItems[tableName][1].PutRequest.Item.haggadah_short_desc
      ).toEqual("Real Script");
      expect(
        params.RequestItems[tableName][1].PutRequest.Item.room_code
      ).toEqual("script#AAAAAF");
      expect(params.RequestItems[tableName][1].PutRequest.Item.path).toEqual(
        `${bucketName}/006-2019_Script`
      );
      expect(
        params.RequestItems[tableName][1].PutRequest.Item.is_script
      ).toEqual(1);
      expect(
        params.RequestItems[tableName][1].PutRequest.Item.haggadah_name
      ).toEqual("0006 - Real Script");
      expect(
        params.RequestItems[tableName][1].PutRequest.Item.script_number
      ).toEqual(6);

      expect(
        params.RequestItems[tableName][4].PutRequest.Item.haggadah_description
      ).toEqual("A script tailored for video seders.");
      expect(params.RequestItems[tableName][4].PutRequest.Item.lib_id).toEqual(
        "script#009"
      );
      expect(
        params.RequestItems[tableName][4].PutRequest.Item.haggadah_short_desc
      ).toEqual("2020 Video Script");
      expect(
        params.RequestItems[tableName][4].PutRequest.Item.room_code
      ).toEqual("script#AAAAAI");
      expect(params.RequestItems[tableName][4].PutRequest.Item.path).toEqual(
        `${bucketName}/009-2020_Video_Seder`
      );
      expect(
        params.RequestItems[tableName][4].PutRequest.Item.is_script
      ).toEqual(1);
      expect(
        params.RequestItems[tableName][4].PutRequest.Item.haggadah_name
      ).toEqual("0009 - 2020 Video Script");
      expect(
        params.RequestItems[tableName][4].PutRequest.Item.script_number
      ).toEqual(9);

      cb(false, { UnprocessedItems: {} });
    });
    jest.mock("aws-sdk", () => {
      return {
        config: {
          update: jest.fn(),
        },
        DynamoDB: {
          DocumentClient: jest.fn(() => {
            return {
              batchWrite: mockBatchWrite,
            };
          }),
        },
      };
    });

    const content2dynamo = require("./content2dynamo");
    const dbResponse = await content2dynamo(
      tableName,
      bucketName,
      contentFilePath
    );
    expect(dbResponse).toEqual({ UnprocessedItems: {} });
    expect(mockBatchWrite).toHaveBeenCalledTimes(1);
  });
});
