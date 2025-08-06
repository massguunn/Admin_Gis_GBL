const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

module.exports = {
  profile(req, res) {
    const id = req.session.userid;

    if (!id) {
      // Jika user belum login, redirect ke login
      req.flash("color", "danger");
      req.flash("status", "Gagal");
      req.flash("message", "Silakan login terlebih dahulu");
      return res.redirect("/login");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi gagal:", err);
        req.flash("color", "danger");
        req.flash("status", "Error");
        req.flash("message", "Gagal terhubung ke database");
        return res.redirect("/login");
      }

      const query = `SELECT * FROM table_user WHERE user_id = ?`;
      connection.query(query, [id], (error, results) => {
        connection.release(); // selalu release di dalam callback!

        if (error) {
          console.error("Query error:", error);
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Gagal mengambil data profil");
          return res.redirect("/login");
        }

        if (results.length === 0) {
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Data pengguna tidak ditemukan");
          return res.redirect("/login");
        }

        const user = results[0];
        const fullUrl = req.protocol + "://" + req.get("host") + "/";

        res.render("profile", {
          url: fullUrl,
          userName: user.user_name,
          nama: user.user_name,
          email: user.user_email,
          fotoProfil: "/images/jaga.jpeg", // default image atau ambil dari database kalau ada
        });
      });
    });
  },
};
