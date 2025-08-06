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

      const sqlEmail = `SELECT * FROM table_user WHERE user_email = ?`;
      connection.query(sqlEmail, [email], (err, userResult) => {
        if (err) {
          connection.release();
          console.error("Query email error:", err);
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Terjadi kesalahan saat mengambil data.");
          return res.redirect("/login");
        }

        if (userResult.length === 0) {
          connection.release();
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Email tidak terdaftar.");
          return res.redirect("/login");
        }

        const sqlPassword = `SELECT * FROM table_user WHERE user_email = ? AND user_password = SHA2(?, 512)`;
        connection.query(sqlPassword, [email, pass], (err2, result2) => {
          connection.release();

          if (err2) {
            console.error("Query password error:", err2);
            req.flash("color", "danger");
            req.flash("status", "Error");
            req.flash("message", "Terjadi kesalahan saat verifikasi password.");
            return res.redirect("/login");
          }

          if (result2.length > 0) {
            // ✅ Sukses login
            req.session.loggedin = true;
            req.session.userid = result2[0].user_id;
            req.session.username = result2[0].user_name;

            console.log("Session setelah login:", req.session);
            return res.redirect("/");
          } else {
            req.flash("color", "error");
            req.flash("status", "Gagal");
            req.flash("message", "Password salah");
            return res.redirect("/login");
          }
        });
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
