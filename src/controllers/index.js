const login = require("./controller-login");
const register = require("./controller-register");
const home = require("./controller-home");
const profile = require("./controller-profile");
const showDashboard = require("./controller-admin");
const gis = require("./controller-gis");
const alatMusik = require("./controller-alatMusik");

module.exports = {
  login,
  register,
  home,
  profile,
  showDashboard,
  gis,
  alatMusik,
};
