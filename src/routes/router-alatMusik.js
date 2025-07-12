const express = require("express");
const router = express.Router();

const alatMusikController = require("../controllers/controller-alatMusik");

const verifyUser = require("../configs/verify");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/peralatan"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

// Tampilkan daftar alat musik
router.get("/", verifyUser.isLogin, alatMusikController.showAlatMusik);

// Tambah data
router.post(
  "/",
  verifyUser.isLogin,
  upload.fields([
    { name: "gambar", maxCount: 1 },
    { name: "suara", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  alatMusikController.insertData
);

// Update berdasarkan ID
router.put(
  "/:id",
  verifyUser.isLogin,
  upload.fields([
    { name: "gambar", maxCount: 1 },
    { name: "suara", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  alatMusikController.updateData
);

// Hapus berdasarkan ID
router.delete("/:id", verifyUser.isLogin, alatMusikController.deleteData);

module.exports = router;
