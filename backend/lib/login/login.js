const Configs = require("../../Configs");
const qs = require("qs");

const login = [
  (req, res) => {
    return res.redirect(301, Configs.idpUrl());
  },
];
module.exports = login;
