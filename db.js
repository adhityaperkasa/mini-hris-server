const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "Oracle!123",  // ← ganti ini!
  database: "mini_hris"
});

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi ke MySQL:", err.message);
    return;
  }
  console.log("Terhubung ke MySQL!");
});

module.exports = db;