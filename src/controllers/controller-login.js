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

  loginAuth(req, res) {
    const email = req.body.email;
    const password = req.body.pass;

    if (email && password) {
      pool.getConnection((err, connection) => {
        if (err) throw err;

        // Langkah 1: cek apakah email terdaftar
        const emailCheckQuery = `SELECT * FROM table_admin WHERE email = ?`;
        connection.query(emailCheckQuery, [email], (err, results) => {
          if (err) {
            console.error("Database error saat koneksi:", err);
            req.flash("color", "danger");
            req.flash("status", "Error");
            req.flash("message", "Terjadi kesalahan pada server.");
            return res.redirect("/login");
          }

          if (results.length === 0) {
            connection.release();
            req.flash("color", "danger");
            req.flash("status", "Gagal");
            req.flash("message", "Email tidak terdaftar");
            return res.redirect("/login");
          }

          // Langkah 2: cek apakah password cocok
          const passwordCheckQuery = `SELECT * FROM table_admin WHERE email = ? AND password = SHA2(?, 512)`;
          connection.query(
            passwordCheckQuery,
            [email, password],
            (err2, result2) => {
              connection.release();

              if (err2) throw err2;

              if (result2.length > 0) {
                // Login sukses
                req.session.loggedin = true;
                req.session.userid = result2[0].id;
                req.session.username = result2[0].name;
                res.redirect("/");
              } else {
                // Password salah
                req.flash("color", "danger");
                req.flash("status", "Gagal");
                req.flash("message", "Password salah");
                res.redirect("/login");
              }
            }
          );
        });
      });
    } else {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Email dan password wajib diisi");
      res.redirect("/login");
    }
  },

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.clearCookie("secretname");
      res.redirect("/login");
    });
  },
};
