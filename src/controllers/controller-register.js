const config = require("../configs/database");
let mysql = require("mysql");
let pool = mysql.createPool(config);

// Handle error dari koneksi pool
pool.on("error", (err) => {
  console.error("Database error:", err);
});

module.exports = {
  // Tampilkan halaman register
  formRegister(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";
    res.render("register", {
      url: fullUrl, // untuk digunakan di register.ejs jika perlu
      colorFlash: req.flash("color"),
      statusFlash: req.flash("status"),
      pesanFlash: req.flash("message"),
    });
  },

  // Simpan data register
  saveRegister(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.pass;

    if (username && email && password) {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Koneksi DB gagal:", err);
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Koneksi ke database gagal");
          return res.redirect("/register");
        }

        const insertQuery = `INSERT INTO table_user (user_name, user_email, user_password) VALUES (?, ?, SHA2(?, 512))`;

        connection.query(
          insertQuery,
          [username, email, password],
          (error, results) => {
            connection.release();

            if (error) {
              console.error("Query error:", error);
              req.flash("color", "danger");
              req.flash("status", "Gagal");
              req.flash(
                "message",
                "Gagal mendaftarkan user. Mungkin email sudah terdaftar."
              );
              return res.redirect("/register");
            }

            req.flash("color", "success");
            req.flash("status", "Yes..");
            req.flash("message", "Registrasi berhasil");
            res.redirect("/login");
          }
        );
      });
    } else {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Semua field wajib diisi");
      res.redirect("/register");
    }
  },
};
