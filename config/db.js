const mysql = require("mysql2/promise");

// createPool lebih baik dari createConnection untuk production:
// otomatis kelola banyak koneksi sekaligus, auto-reconnect kalau putus
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Tes koneksi sekali saat server pertama nyala
db.getConnection()
  .then((connection) => {
    console.log("Terhubung ke MySQL!");
    connection.release();
  })
  .catch((err) => {
    console.error("Gagal koneksi ke MySQL:", err.message);
  });

module.exports = db;