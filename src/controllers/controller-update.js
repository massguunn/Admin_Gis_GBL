const config = require("../configs/database");

let mysql = require("mysql");
let pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  formUpdate(req, res) {
    res.render("admin", {
      url: "http://localhost:3000/",
    });
  },

  updateData(req, res) {
    const id = req.params.id;
    const {
      nama_gb,
      alamat_gb,
      nomer_hp,
      harga,
      deskripsi,
      gambar,
      latitude,
      longitude,
      map,
    } = req.body;

    const sql = `
      UPDATE data_GB
      SET nama_gb = ?, alamat_gb = ?, nomer_hp = ?, harga = ?, deskripsi = ?, gambar = ?, latitude = ?, longitude = ?, map = ?
      WHERE id = ?
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
      id,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Gagal update data:", err);
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
};
