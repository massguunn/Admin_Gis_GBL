const express = require("express");
const router = express.Router();
const adminController = require("../controllers/controller-admin");
const verifyUser = require("../configs/verify");
const upload = require("../configs/upload");

// Tampilkan halaman admin
router.get("/admin", verifyUser.isLogin, adminController.showDashboard);

// Tambah data
// router.post("/admin", verifyUser.isLogin, adminController.insertData);

// Update data berdasarkan ID
// router.put("/admin/:id", verifyUser.isLogin, adminController.updateData);

// Hapus data berdasarkan ID
router.delete("/admin/:id", verifyUser.isLogin, adminController.deleteData);

router.post(
  "/admin",
  verifyUser.isLogin,
  upload.single("gambar"),
  (req, res, next) => {
    // console.log("DEBUG - req.body:", req.body);
    // console.log("DEBUG - req.file:", req.file);
    next();
  },
  adminController.insertData
);

router.put(
  "/admin/:id",
  verifyUser.isLogin,
  upload.single("gambar"),
  adminController.updateData
);

module.exports = router;
