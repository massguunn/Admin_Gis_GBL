const config = require("../configs/database");

let mysql = require("mysql");
let pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  login(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";

    res.render("login", {
      url: fullUrl, // sekarang sudah didefinisikan
      colorFlash: req.flash("color"),
      statusFlash: req.flash("status"),
      pesanFlash: req.flash("message"),
    });
  },
  // Post / kirim data yang diinput user
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

      const query = `SELECT * FROM table_admin WHERE user_email = ?`;
      connection.query(query, [email], (err, results) => {
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

        const user = results[0];

        const passwordQuery = `SELECT * FROM table_admin WHERE user_email = ? AND user_password = SHA2(?, 512)`;
        connection.query(passwordQuery, [email, password], (err2, result2) => {
          connection.release();

          if (err2) {
            console.error("Query error (password):", err2);
            req.flash("color", "danger");
            req.flash("status", "Error");
            req.flash("message", "Terjadi kesalahan saat verifikasi");
            return res.redirect("/login");
          }

          if (result2.length > 0) {
            req.session.loggedin = true;
            req.session.userid = result2[0].id;
            req.session.username = result2[0].name;
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

  logout(req, res) {
    // Hapus sesi user dari broser
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      // Hapus cokie yang masih tertinggal
      res.clearCookie("secretname");
      res.redirect("/login");
    });
  },
};
