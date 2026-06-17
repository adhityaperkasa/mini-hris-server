const db = require("../config/db");

// GET semua employee
const getEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

// GET employee by id
const getEmployeeById = (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM employees WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) {
        return res.status(404).json({ message: "Employee tidak ditemukan" });
      }
      res.json(results[0]);
    }
  );
};

// POST tambah employee
const createEmployee = (req, res) => {
  const { empNo, name, department, position, status } = req.body;
  db.query(
    "INSERT INTO employees (empNo, name, department, position, status) VALUES (?, ?, ?, ?, ?)",
    [empNo, name, department, position, status],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({
        id: results.insertId,
        empNo, name, department, position, status
      });
    }
  );
};

// PUT update employee
const updateEmployee = (req, res) => {
  const id = req.params.id;
  const { empNo, name, department, position, status } = req.body;
  db.query(
    "UPDATE employees SET empNo=?, name=?, department=?, position=?, status=? WHERE id=?",
    [empNo, name, department, position, status, id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: Number(id), empNo, name, department, position, status });
    }
  );
};

// DELETE hapus employee
const deleteEmployee = (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM employees WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Employee berhasil dihapus" });
    }
  );
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};