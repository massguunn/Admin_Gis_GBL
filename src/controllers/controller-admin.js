const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  showDashboard(req, res) {
    console.log("showDashboard jalan");
    res.render("admin", {
      // url: "http://localhost:3000/", local
      url: req.protocol + "://" + req.get("host") + "/",
    });
  },

  // untukk ambil data
  showDashboard(req, res) {
    const query = "SELECT * FROM data_GB";

    pool.query(query, (err, results) => {
      if (err) {
        console.error("Gagal ambil data:", err);
        return res.status(500).send("Gagal ambil data dari database");
      }

      // ⬅️ Kirim data ke EJS
      res.render("admin", {
        data: results, //
      });
    });
  },

  //untuk menambahkan data
  insertData(req, res) {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const {
      nama_gb,
      alamat_gb,
      nomer_hp,
      harga,
      deskripsi,
      latitude,
      longitude,
      map,
      jm_gendang,
      jm_suling,
      jm_cemprang,
      jm_reong,
      jm_gong,
      jm_petuq,
      jm_rencek,
      link_fb,
      link_ig,
    } = req.body;
    let gambar = null;
    if (req.file) {
      gambar = "/uploads/" + req.file.filename;
    } else {
      return res.status(400).json({
        status: "error",
        message: "Gambar harus diupload",
      });
    }

    const sql = `
      INSERT INTO data_GB (nama_gb, alamat_gb, nomer_hp, harga, deskripsi, gambar, latitude, longitude, map, jm_gendang, jm_suling, jm_cemprang, jm_reong, jm_gong, jm_petuq, jm_rencek, link_fb, link_ig)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nama_gb,
      alamat_gb,
      nomer_hp,
      harga,
      deskripsi,
      gambar,
      latitude,
      longitude,
      map,
      jm_gendang,
      jm_suling,
      jm_cemprang,
      jm_reong,
      jm_gong,
      jm_petuq,
      jm_rencek,
      link_fb,
      link_ig,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal menambahkan data" });
      }
      res.redirect("/admin");
    });
  },

  updateData(req, res) {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    const id = req.params.id;
    const {
      nama_gb,
      alamat_gb,
      nomer_hp,
      harga,
      deskripsi,
      latitude,
      longitude,
      map,
      jm_gendang,
      jm_suling,
      jm_cemprang,
      jm_reong,
      jm_gong,
      jm_petuq,
      jm_rencek,
      link_fb,
      link_ig,
    } = req.body;

    let sql = "";
    let values = [];

    if (req.file) {
      // Ada file baru, update semua termasuk gambar
      const gambar = "/uploads/" + req.file.filename;
      sql = `
      UPDATE data_GB SET nama_gb=?, alamat_gb=?, nomer_hp=?, harga=?, deskripsi=?, gambar=?, latitude=?, longitude=?, map=?, jm_gendang=?, jm_suling=?, jm_cemprang=?, jm_reong=?, jm_gong=?, jm_petuq=?, jm_rencek=?, link_fb=?, link_ig=?
      WHERE id=?
    `;
      values = [
        nama_gb,
        alamat_gb,
        nomer_hp,
        harga,
        deskripsi,
        gambar,
        latitude,
        longitude,
        map,
        jm_gendang,
        jm_suling,
        jm_cemprang,
        jm_reong,
        jm_gong,
        jm_petuq,
        jm_rencek,
        link_fb,
        link_ig,
        id,
      ];
    } else {
      // Tidak ada file baru, jangan update kolom gambar
      sql = `
      UPDATE data_GB SET nama_gb=?, alamat_gb=?, nomer_hp=?, harga=?, deskripsi=?, latitude=?, longitude=?, map=?, jm_gendang=?, jm_suling=?, jm_cemprang=?, jm_reong=?, jm_gong=?, jm_petuq=?, jm_rencek=?, link_fb=?, link_ig=?
      WHERE id=?
    `;
      values = [
        nama_gb,
        alamat_gb,
        nomer_hp,
        harga,
        deskripsi,
        latitude,
        longitude,
        map,
        jm_gendang,
        jm_suling,
        jm_cemprang,
        jm_reong,
        jm_gong,
        jm_petuq,
        jm_rencek,
        link_fb,
        link_ig,
        id,
      ];
    }

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal mengupdate data" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "Data tidak ditemukan" });
      }
      res.json({ status: "success", message: "Data berhasil diupdate" });
    });
  },

  //fungsi delete
  deleteData(req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM data_GB WHERE id = ?";

    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error menghapus data");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Data tidak ditemukan");
      }

      res.send("Data berhasil dihapus"); // atau redirect misal: res.redirect("/admin");
    });
  },
};
