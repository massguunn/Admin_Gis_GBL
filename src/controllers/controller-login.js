const config = require("../configs/database");
let mysql = require("mysql");
let pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // GET /login
  login(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";

    res.render("login", {
      url: fullUrl,
      colorFlash: req.flash("color"),
      statusFlash: req.flash("status"),
      pesanFlash: req.flash("message"),
    });
  },

  // POST /login
  loginAuth(req, res) {
    const email = req.body.email;
    const password = req.body.pass;

    if (!email || !password) {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Email dan password wajib diisi");
      return res.redirect("/login");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi DB gagal:", err);
        req.flash("color", "danger");
        req.flash("status", "Error");
        req.flash("message", "Gagal terhubung ke database");
        return res.redirect("/login");
      }

      // Langkah 1: Cek apakah email ada
      const checkEmail = `SELECT * FROM table_user WHERE user_email = ?`;
      connection.query(checkEmail, [email], (err, results) => {
        if (err) {
          connection.release();
          console.error("Query error:", err);
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Terjadi kesalahan saat mengambil data");
          return res.redirect("/login");
        }

        if (results.length === 0) {
          connection.release();
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Email tidak terdaftar");
          return res.redirect("/login");
        }

        // Langkah 2: Cek password
        const checkPassword = `SELECT * FROM table_user WHERE user_email = ? AND user_password = SHA2(?, 512)`;
        connection.query(checkPassword, [email, password], (err2, result2) => {
          connection.release();

          if (err2) {
            console.error("Query error (password):", err2);
            req.flash("color", "danger");
            req.flash("status", "Error");
            req.flash("message", "Terjadi kesalahan saat verifikasi");
            return res.redirect("/login");
          }

          if (result2.length > 0) {
            // Login sukses
            // Berhasil login
            req.session.loggedin = true;
            req.session.userid = results[0].user_id;
            req.session.username = results[0].user_name;

            console.log("Session setelah login:", req.session);
            res.redirect("/");
          } else {
            req.flash("color", "danger");
            req.flash("status", "Gagal");
            req.flash("message", "Password salah");
            res.redirect("/login");
          }
        });
      });
    });
  },

  // GET /logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.clearCookie("secretname");
      res.redirect("/login");
    });
  },
};
