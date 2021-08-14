const script2json = require("../lib/script2json");
const txt2json = [
  (req, res, next) => {
    if (!(req.body && req.body.text)) {
      return res.status(400).send({
        error:
          "POST body should be application/json," +
          " should have a text property, and should start with a # {{Page}}\n marker",
        exampleOKBody: {
          text: "# {{Page}}\n\n# The simplest possible script",
        },
      });
    }
    return next();
  },
  (req, res, next) => {
    console.log("middleware/txt2json: logging...");
    console.log("middleware/txt2json: req.body.text:");
    console.log(req.body.text);
    let data;
    try {
      data = script2json.parse(req.body.text);
      return res.send(data);
    } catch (err) {
      console.log(
        "middleware/txt2json: error on data = script2json.parse(req.body.text)"
      );
      console.log(err);
    }
    return res.status(400).send("txt2json_error");
  },
];
module.exports = txt2json;
