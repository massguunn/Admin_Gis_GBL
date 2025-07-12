const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  home(req, res) {
    const sqlCount = "SELECT COUNT(*) AS totalGB FROM data_GB";

    pool.query(sqlCount, (err, results) => {
      // <-- ganti db.query jadi pool.query
      if (err) {
        console.error(err);
        return res.status(500).send("Database error");
      }

      const totalGB = results[0].totalGB;

      // res.render("home", {
      //   url: "http://localhost:3000/",
      //   userName: req.session.username,
      //   totalGB: totalGB,
      // });

      res.render("home", {
        url: req.protocol + "://" + req.get("host") + "/",
        userName: req.session.username,
        totalGB: totalGB,
      });
    });
  },
};
