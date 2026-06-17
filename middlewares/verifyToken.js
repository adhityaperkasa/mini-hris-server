const jwt = require("jsonwebtoken");

const JWT_SECRET = "ganti_ini_dengan_kunci_rahasia_yang_panjang_dan_acak";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan, silakan login" });
  }

  // Format header: "Bearer xxxxx.yyyyy.zzzzz"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Format token tidak valid" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau sudah expired" });
    }

    // Simpan data user yang sudah login ke request, supaya bisa dipakai controller
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;