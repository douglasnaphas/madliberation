const Configs = require("../../Configs");

const login = [
  (req, res) => {
    return res.redirect(301, Configs.idpUrl());
  },
];
module.exports = login;
