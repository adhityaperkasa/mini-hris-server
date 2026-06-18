const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// GET semua employee (dengan pagination & search)
const getEmployees = asyncHandler(async (req, res) => {

  // Ambil query params, kasih nilai default kalau tidak dikirim
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const offset = (page - 1) * limit;

  // Hitung total data yang cocok (untuk tahu jumlah total halaman)
  const [countResult] = await db.query(
    "SELECT COUNT(*) AS total FROM employees WHERE name LIKE ?",
    [`%${search}%`]
  );
  const totalItems = countResult[0].total;
  const totalPages = Math.ceil(totalItems / limit);

  // Ambil data sesuai halaman & search
  const [results] = await db.query(
    "SELECT * FROM employees WHERE name LIKE ? LIMIT ? OFFSET ?",
    [`%${search}%`, limit, offset]
  );

  res.json({
    data: results,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  });
});

// GET employee by id
const getEmployeeById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const [results] = await db.query(
    "SELECT * FROM employees WHERE id = ?",
    [id]
  );

  if (results.length === 0) {
    return res.status(404).json({ message: "Employee tidak ditemukan" });
  }

  res.json(results[0]);
});

// POST tambah employee
const createEmployee = asyncHandler(async (req, res) => {
  const { empNo, name, department, position, status } = req.body;

  const [results] = await db.query(
    "INSERT INTO employees (empNo, name, department, position, status) VALUES (?, ?, ?, ?, ?)",
    [empNo, name, department, position, status]
  );

  res.status(201).json({
    id: results.insertId,
    empNo, name, department, position, status
  });
});

// PUT update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { empNo, name, department, position, status } = req.body;

  const [results] = await db.query(
    "UPDATE employees SET empNo=?, name=?, department=?, position=?, status=? WHERE id=?",
    [empNo, name, department, position, status, id]
  );

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: "Employee tidak ditemukan" });
  }

  res.json({ id: Number(id), empNo, name, department, position, status });
});

// DELETE hapus employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const [results] = await db.query(
    "DELETE FROM employees WHERE id = ?",
    [id]
  );

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: "Employee tidak ditemukan" });
  }

  res.json({ message: "Employee berhasil dihapus" });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};