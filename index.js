const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ========================
// EMPLOYEE ROUTES
// ========================

// GET semua employee
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET employee by id
app.get("/employees/:id", (req, res) => {
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
});

// POST tambah employee
app.post("/employees", (req, res) => {
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
});

// PUT update employee
app.put("/employees/:id", (req, res) => {
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
});

// DELETE hapus employee
app.delete("/employees/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM employees WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Employee berhasil dihapus" });
    }
  );
});

// ========================
// ORG ROUTES
// ========================

// GET semua org
app.get("/org", (req, res) => {
  db.query("SELECT * FROM org", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// POST tambah org node
app.post("/org", (req, res) => {
  const { name, type, parentId } = req.body;
  db.query(
    "INSERT INTO org (name, type, parentId) VALUES (?, ?, ?)",
    [name, type, parentId || null],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({
        id: results.insertId,
        name, type, parentId: parentId || null
      });
    }
  );
});

// PUT update org node
app.put("/org/:id", (req, res) => {
  const id = req.params.id;
  const { name, type, parentId } = req.body;
  db.query(
    "UPDATE org SET name=?, type=?, parentId=? WHERE id=?",
    [name, type, parentId || null, id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: Number(id), name, type, parentId: parentId || null });
    }
  );
});

// DELETE hapus org node
app.delete("/org/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM org WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Node berhasil dihapus" });
    }
  );
});

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});