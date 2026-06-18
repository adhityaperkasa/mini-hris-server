// Error handler PUNYA 4 PARAMETER (err di depan) — ini yang membuat
// Express mengenalinya sebagai error-handling middleware, bukan middleware biasa

const errorHandler = (err, req, res, next) => {

  console.error("Error tertangkap:", err.message);

  // Error dari MySQL: duplikat data (misal username/empNo sudah ada)
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ message: "Data sudah ada, tidak boleh duplikat" });
  }

  // Error dari MySQL: foreign key tidak valid
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ message: "Data referensi tidak ditemukan" });
  }

  // Error JWT yang lolos dari verifyToken (jaga-jaga)
  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({ message: "Token tidak valid" });
  }

  // Default: error tidak terduga lainnya
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
};

module.exports = errorHandler;