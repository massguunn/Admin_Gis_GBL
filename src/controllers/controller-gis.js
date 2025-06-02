const { gis } = require(".");
const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  gis(req, res) {
    const query = "SELECT * FROM data_GB";

    pool.query(query, (err, results) => {
      if (err) {
        console.error("Gagal ambil data:", err);
        return res.status(500).send("Gagal ambil data dari database");
      }

      res.render("gis", {
        data: results, // ⬅️ Ini penting!
        url: "http://localhost:3000/",
      });
    });
  },
};
