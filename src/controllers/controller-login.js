const config = require("../configs/database");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const pool = mysql.createPool(config);

// Error handler
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
    const { user_email, user_password } = req.body;

    const query = "SELECT * FROM tb_user WHERE user_email = ?";
    pool.query(query, [user_email], (err, result2) => {
      if (err) {
        console.log("Error saat login:", err);
        req.flash("color", "error");
        req.flash("status", "Error");
        req.flash("message", "Terjadi kesalahan pada server");
        return res.redirect("/login");
      }

      if (result2.length === 0) {
        req.flash("color", "error");
        req.flash("status", "Gagal");
        req.flash("message", "Email tidak ditemukan");
        return res.redirect("/login");
      }

      const hashedPassword = result2[0].user_password;
      bcrypt.compare(user_password, hashedPassword, (err, isMatch) => {
        if (err || !isMatch) {
          req.flash("color", "error");
          req.flash("status", "Gagal");
          req.flash("message", "Password salah");
          return res.redirect("/login");
        }

        // ✅ Login berhasil → set session
        req.session.loggedin = true;
        req.session.userid = result2[0].user_id;
        req.session.username = result2[0].user_name;

        console.log("Berhasil login. Session:", req.session);
        res.redirect("/");
      });
    });
  },

  // GET /logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Gagal logout:", err);
      }
      res.clearCookie("secretName");
      res.redirect("/login");
    });
  },
};
