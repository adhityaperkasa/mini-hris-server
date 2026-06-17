const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "ganti_ini_dengan_kunci_rahasia_yang_panjang_dan_acak";

// REGISTER - buat user baru
const register = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  // Enkripsi password sebelum disimpan
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role || "employee"],
    (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Username sudah digunakan" });
        }
        console.error("Error register:", err.message);
        return res.status(500).json({ message: "Gagal membuat user" });
      }

      res.status(201).json({
        message: "User berhasil dibuat",
        id: results.insertId,
        username,
        role: role || "employee"
      });
    }
  );
};

// LOGIN
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error login:", err.message);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Username atau password salah" });
      }

      const user = results[0];

      // Bandingkan password yang diinput dengan yang terenkripsi di database
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Username atau password salah" });
      }

      // Buat token JWT, isinya data user (kecuali password)
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
};

module.exports = { register, login };