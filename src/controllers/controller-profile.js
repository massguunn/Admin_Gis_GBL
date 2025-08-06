const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error("MySQL pool error:", err);
});

module.exports = {
  profile(req, res) {
    const id = req.session.userid;

    if (!id) {
      // Jika user belum login
      req.flash("color", "danger");
      req.flash("status", "Gagal");
      req.flash("message", "Silakan login terlebih dahulu");
      return res.redirect("/login");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection failed:", err);
        req.flash("color", "danger");
        req.flash("status", "Error");
        req.flash("message", "Koneksi ke database gagal");
        return res.redirect("/login");
      }

      const sql = `SELECT * FROM table_user WHERE user_id = ?`;
      connection.query(sql, [id], (error, results) => {
        connection.release(); // Aman: pastikan dilepas setelah query selesai

        if (error) {
          console.error("Query error:", error);
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Gagal mengambil data user");
          return res.redirect("/login");
        }

        if (results.length === 0) {
          // Jika user tidak ditemukan
          req.flash("color", "warning");
          req.flash("status", "Oops");
          req.flash("message", "Data user tidak ditemukan");
          return res.redirect("/login");
        }

        const user = results[0];
        const fullUrl = req.protocol + "://" + req.get("host") + "/";

        res.render("profile", {
          url: fullUrl,
          userName: user.user_name,
          nama: user.user_name,
          email: user.user_email,
          fotoProfil: user.user_photo || "/images/jaga.jpeg", // fallback
        });
      });
    });
  },
};
