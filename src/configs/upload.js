const fs = require("fs");
const uploadDir = "public/uploads";

// Pastikan folder ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "gambar-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// ✅ PENTING: export di akhir
module.exports = upload;
