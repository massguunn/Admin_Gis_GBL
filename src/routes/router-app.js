const router = require("express").Router();
const homeController = require("../controllers").home;
const profileController = require("../controllers").profile;
const verifyUser = require("../configs/verify");
const gisController = require("../controllers").gis;

router.get("/", verifyUser.isLogin, homeController.home);
router.get("/profile", verifyUser.isLogin, profileController.profile);
router.get("/gis", verifyUser.isLogin, gisController.gis);

module.exports = router;
