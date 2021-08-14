/* globals jest, expect */
const bucket = require("./bucket");
describe("bucket", () => {
  test.each`
    path                                                                                    | expectedBucket                                                      | expectedKey
    ${"douglasnaphasmadliberation2-scriptsbucket40feb4b1-tjyg3bef8nry/004-Practice_Script"} | ${"douglasnaphasmadliberation2-scriptsbucket40feb4b1-tjyg3bef8nry"} | ${"004-Practice_Script.json"}
    ${"douglasnaphasmadliberation2-scriptsbucket40feb4b1-tjyg3bef8nry/006-2019_Script"}     | ${"douglasnaphasmadliberation2-scriptsbucket40feb4b1-tjyg3bef8nry"} | ${"006-2019_Script.json"}
    ${"abc/def"}                                                                            | ${"abc"}                                                            | ${"def.json"}
  `(
    "$path -> Bucket: $expectedBucket, key: $expectedKey",
    ({ path, expectedBucket, expectedKey }) => {
      expect(bucket.Bucket(path)).toEqual(expectedBucket);
      expect(bucket.path2key(path)).toEqual(expectedKey);
    }
  );
});
