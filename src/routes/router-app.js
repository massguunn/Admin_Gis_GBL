const router = require("express").Router();
const homeController = require("../controllers").home;
const profileController = require("../controllers").profile;
const verifyUser = require("../configs/verify");
const gisController = require("../controllers").gis;
// const alatMusikController = require("../controllers").alatMusik;

router.get("/", verifyUser.isLogin, homeController.home);
router.get("/profile", verifyUser.isLogin, profileController.profile);
router.get("/gis", verifyUser.isLogin, gisController.gis);

// //kode untuk crud alat musik
// router.get("/alatMusik", verifyUser.isLogin, alatMusikController.showAlatMusik);

module.exports = router;
