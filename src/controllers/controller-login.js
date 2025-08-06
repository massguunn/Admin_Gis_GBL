const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error("Database error:", err);
});

module.exports = {
  // GET /login
  login(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";

    res.render("login", {
      url: fullUrl,
      colorFlash: req.flash("color") || null,
      statusFlash: req.flash("status") || null,
      pesanFlash: req.flash("message") || null,
    });
  },

  // POST /login
  loginAuth(req, res) {
    const { email, pass } = req.body;

    if (!email || !pass) {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Email dan password wajib diisi!");
      return res.redirect("/login");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi DB gagal:", err);
        req.flash("color", "danger");
        req.flash("status", "Error");
        req.flash("message", "Tidak dapat terhubung ke database.");
        return res.redirect("/login");
      }

      // Query: cek email & password langsung
      const sql = `SELECT * FROM table_user WHERE user_email = ? AND user_password = SHA2(?, 512)`;
      connection.query(sql, [email, pass], (err2, result) => {
        connection.release();

        if (err2) {
          console.error("Query error:", err2);
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Terjadi kesalahan saat login.");
          return res.redirect("/login");
        }

        if (result.length === 0) {
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Email atau password salah.");
          return res.redirect("/login");
        }

        // ✅ Login berhasil
        req.session.loggedin = true;
        req.session.userid = result[0].user_id;
        req.session.username = result[0].user_name;

        console.log("Login berhasil. Session:", req.session);
        return res.redirect("/");
      });
    });
  },

  // GET /logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Gagal logout:", err);
      }
      res.clearCookie("secretname");
      res.redirect("/login");
    });
  },
};
