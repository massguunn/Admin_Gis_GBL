const config = require("../configs/database");
const mysql = require("mysql");

const pool = mysql.createPool(config);
pool.on("error", (err) => console.error(err));

module.exports = {
  showAlatMusik(req, res) {
    const query = "SELECT * FROM alat_musik";

    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Gagal menampilkan data.");
      }
      res.render("alatMusik", { data: results });
    });
  },

  insertData(req, res) {
    const { nama, deskripsi } = req.body;

    let gambar = null;
    let suara = null;
    let video = null;

    if (req.files && req.files.gambar && req.files.gambar.length > 0) {
      gambar = "/peralatan/" + req.files.gambar[0].filename;
    }
    if (req.files && req.files.suara && req.files.suara.length > 0) {
      suara = "/peralatan/" + req.files.suara[0].filename;
    }
    if (req.files && req.files.video && req.files.video.length > 0) {
      video = "/peralatan/" + req.files.video[0].filename;
    }

    const query =
      "INSERT INTO alat_musik (nama, deskripsi, gambar, suara, video) VALUES(?,?,?,?,?)";
    pool.query(
      query,
      [nama, deskripsi, gambar, suara, video],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Gagal menyimpan data.");
        }
        res.redirect("/alatMusik");
      }
    );
  },

  updateData(req, res) {
    const id = req.params.id;
    const { nama, deskripsi, gambar_lama, suara_lama, video_lama } = req.body;

    let gambar = gambar_lama;
    let suara = suara_lama;
    let video = video_lama;

    if (req.files && req.files.gambar && req.files.gambar.length > 0) {
      gambar = "/peralatan/" + req.files.gambar[0].filename;
    }
    if (req.files && req.files.suara && req.files.suara.length > 0) {
      suara = "/peralatan/" + req.files.suara[0].filename;
    }
    if (req.files && req.files.video && req.files.video.length > 0) {
      video = "/peralatan/" + req.files.video[0].filename;
    }

    pool.query(
      "UPDATE alat_musik SET nama = ?, deskripsi = ?, gambar = ?, suara = ?, video = ? WHERE id = ?",
      [nama, deskripsi, gambar, suara, video, id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Gagal menyimpan.");
        }
        res.redirect("/alatMusik");
      }
    );
  },

  deleteData(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM alat_musik WHERE id = ?";

    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Gagal menghapus data.");
      }
      res.redirect("/alatMusik");
    });
  },

  //   //fungsi delete
  //   deleteData(req, res) {
  //     const id = req.params.id;
  //     const sql = "DELETE FROM alat_musik WHERE id = ?";

  //     pool.query(sql, [id], (err, result) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).send("Error menghapus data");
  //       }

  //       if (result.affectedRows === 0) {
  //         return res.status(404).send("Data tidak ditemukan");
  //       }

  //       res.send("Data berhasil dihapus"); // atau redirect misal: res.redirect("/admin");
  //     });
  //   },
};
