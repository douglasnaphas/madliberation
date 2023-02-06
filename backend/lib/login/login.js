const Configs = require("../../Configs");
const qs = require("qs");

const login = [
  (req, res) => {
    return res.redirect(
      301,
      Configs.idpUrl() +
        (req.query["return-page"]
          ? `&return-page=${req.query["return-page"]}`
          : "")
    );
  },
];
module.exports = login;
