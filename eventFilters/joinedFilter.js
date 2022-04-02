const schema = require("../backend/schema");
const joinedFilter = JSON.stringify({
  Pattern: {
    dynamodb: {
      NewImage: {
        [schema.SORT_KEY]: {
          S: [
            {
              prefix: `${schema.PARTICIPANT_PREFIX}${schema.SEPARATOR}`,
            },
          ],
        },
      },
    },
  },
});
module.exports = joinedFilter;
