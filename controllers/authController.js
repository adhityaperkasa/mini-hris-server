const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER - buat user baru
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [results] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "employee"]
    );

    res.status(201).json({
      message: "User berhasil dibuat",
      id: results.insertId,
      username,
      role: role || "employee"
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    console.error("Error register:", err.message);
    res.status(500).json({ message: "Gagal membuat user" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

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
  } catch (err) {
    console.error("Error login:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { register, login };