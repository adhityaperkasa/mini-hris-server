const db = require("../config/db");

// GET semua employee
const getEmployees = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM employees");
    res.json(results);
  } catch (err) {
    console.error("Error getEmployees:", err.message);
    res.status(500).json({ message: "Gagal mengambil data employee" });
  }
};

// GET employee by id
const getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const [results] = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Employee tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error getEmployeeById:", err.message);
    res.status(500).json({ message: "Gagal mengambil data employee" });
  }
};

// POST tambah employee
const createEmployee = async (req, res) => {
  try {
    const { empNo, name, department, position, status } = req.body;

    const [results] = await db.query(
      "INSERT INTO employees (empNo, name, department, position, status) VALUES (?, ?, ?, ?, ?)",
      [empNo, name, department, position, status]
    );

    res.status(201).json({
      id: results.insertId,
      empNo, name, department, position, status
    });
  } catch (err) {
    console.error("Error createEmployee:", err.message);
    res.status(500).json({ message: "Gagal menambahkan employee" });
  }
};

// PUT update employee
const updateEmployee = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error updateEmployee:", err.message);
    res.status(500).json({ message: "Gagal mengupdate employee" });
  }
};

// DELETE hapus employee
const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;

    const [results] = await db.query(
      "DELETE FROM employees WHERE id = ?",
      [id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Employee tidak ditemukan" });
    }

    res.json({ message: "Employee berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteEmployee:", err.message);
    res.status(500).json({ message: "Gagal menghapus employee" });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};