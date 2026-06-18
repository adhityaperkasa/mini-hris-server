const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER - buat user baru
const register = asyncHandler(async (req, res) => {
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
});

// LOGIN
const login = asyncHandler(async (req, res) => {
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
});

module.exports = { register, login };