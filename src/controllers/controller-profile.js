const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

module.exports = {
  profile(req, res) {
    // Cek apakah user sudah login
    if (!req.session.userid) {
      console.log("Session user ID tidak ditemukan. Redirect ke login.");
      return res.redirect("/login");
    }

    const userId = req.session.userid;

    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("Koneksi database gagal:", err);
        return res.status(500).send("Koneksi database gagal.");
      }

      // Jalankan query ambil data user
      connection.query(
        `SELECT * FROM table_user WHERE user_id = ?`,
        [userId],
        function (error, results) {
          connection.release(); // pastikan connection dilepas

          if (error) {
            console.error("Query error:", error);
            return res.status(500).send("Query gagal dijalankan.");
          }

          if (results.length === 0) {
            console.warn("User tidak ditemukan:", userId);
            return res.status(404).send("User tidak ditemukan.");
          }

          const user = results[0];
          const fullUrl = req.protocol + "://" + req.get("host") + "/";

          console.log("Data user ditemukan:", user);

          // Render halaman profile dengan data user
          res.render("profile", {
            url: fullUrl,
            userName: req.session.username || user.user_name,
            nama: user.user_name,
            email: user.user_email,
            fotoProfil: "/images/jaga.jpeg", // Bisa diganti sesuai data dari DB
          });
        }
      );
    });
  },
};
