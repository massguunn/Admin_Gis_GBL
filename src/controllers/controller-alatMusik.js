const config = require("../configs/database");
const mysql = require("mysql");

const pool = mysql.createPool(config);
pool.on("error", (err) => console.error(err));

module.exports = {
  showAlatMusik(req, res) {
    const query = "SELECT * FROM alat_musik ORDER BY id DESC";

    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Gagal menampilkan data.");
      }

      res.render("alatMusik", {
        data: results,
        swalMessage: req.flash("swal_message") || [],
        swalIcon: req.flash("swal_icon") || [],
      });
    });
  },

  insertData(req, res) {
    const { nama, deskripsi } = req.body;

    let gambar = null;
    let suara = null;
    let video = null;

    if (req.files?.gambar?.length > 0) {
      gambar = "/peralatan/" + req.files.gambar[0].filename;
    }
    if (req.files?.suara?.length > 0) {
      suara = "/peralatan/" + req.files.suara[0].filename;
    }
    if (req.files?.video?.length > 0) {
      video = "/peralatan/" + req.files.video[0].filename;
    }

    const query = `INSERT INTO alat_musik (nama, deskripsi, gambar, suara, video) VALUES (?, ?, ?, ?, ?)`;

    pool.query(
      query,
      [nama, deskripsi, gambar, suara, video],
      (err, result) => {
        if (err) {
          console.error(err);
          req.flash("swal_message", "Gagal menyimpan data.");
          req.flash("swal_icon", "error");
          return res.redirect("/alatMusik");
        }

        req.flash("swal_message", "Data berhasil ditambahkan.");
        req.flash("swal_icon", "success");
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

    if (req.files?.gambar?.length > 0) {
      gambar = "/peralatan/" + req.files.gambar[0].filename;
    }
    if (req.files?.suara?.length > 0) {
      suara = "/peralatan/" + req.files.suara[0].filename;
    }
    if (req.files?.video?.length > 0) {
      video = "/peralatan/" + req.files.video[0].filename;
    }

    const query = `UPDATE alat_musik SET nama = ?, deskripsi = ?, gambar = ?, suara = ?, video = ? WHERE id = ?`;

    pool.query(
      query,
      [nama, deskripsi, gambar, suara, video, id],
      (err, result) => {
        if (err) {
          console.error(err);
          req.flash("swal_message", "Gagal menyimpan perubahan.");
          req.flash("swal_icon", "error");
          return res.redirect("/alatMusik");
        }

        req.flash("swal_message", "Data berhasil diperbarui.");
        req.flash("swal_icon", "info");
        res.redirect("/alatMusik");
      }
    );
  },

  deleteData(req, res) {
    const id = req.params.id;
    const query = `DELETE FROM alat_musik WHERE id = ?`;

    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        req.flash("swal_message", "Gagal menghapus data.");
        req.flash("swal_icon", "error");
        return res.redirect("/alatMusik");
      }

      req.flash("swal_message", "Data berhasil dihapus.");
      req.flash("swal_icon", "warning");
      res.redirect("/alatMusik");
    });
  },
};
