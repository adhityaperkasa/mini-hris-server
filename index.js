const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATA SEMENTARA (nanti diganti MySQL)
let employees = [
  {
    id: 1,
    empNo: "EMP001",
    name: "John Doe",
    department: "HR Recruitment Department",
    position: "Recruitment Manager",
    status: "Active"
  }
];

let org = [
  { id: 1, type: "company", name: "PT ABCD", parentId: null },
  { id: 2, type: "directorate", name: "HR Directorate", parentId: 1 },
  { id: 3, type: "division", name: "HR Division", parentId: 2 },
  { id: 4, type: "department", name: "HR Recruitment Department", parentId: 3 },
  { id: 5, type: "position", name: "Recruitment Manager", parentId: 4 },
  { id: 6, type: "position", name: "Recruiter", parentId: 4 }
];

// ========================
// EMPLOYEE ROUTES
// ========================

// GET semua employee
app.get("/employees", (req, res) => {
  res.json(employees);
});

// GET employee by id
app.get("/employees/:id", (req, res) => {
  const id = Number(req.params.id);
  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return res.status(404).json({ message: "Employee tidak ditemukan" });
  }

  res.json(employee);
});

// POST tambah employee
app.post("/employees", (req, res) => {
  const newEmployee = {
    id: Date.now(),
    ...req.body
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// PUT update employee
app.put("/employees/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = employees.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee tidak ditemukan" });
  }

  employees[index] = { id, ...req.body };
  res.json(employees[index]);
});

// DELETE hapus employee
app.delete("/employees/:id", (req, res) => {
  const id = Number(req.params.id);
  employees = employees.filter(e => e.id !== id);
  res.json({ message: "Employee berhasil dihapus" });
});

// ========================
// ORG ROUTES
// ========================

// GET semua org
app.get("/org", (req, res) => {
  res.json(org);
});

// POST tambah org node
app.post("/org", (req, res) => {
  const newNode = {
    id: Date.now(),
    ...req.body
  };

  org.push(newNode);
  res.status(201).json(newNode);
});

// PUT update org node
app.put("/org/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = org.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Node tidak ditemukan" });
  }

  org[index] = { id, ...req.body };
  res.json(org[index]);
});

// DELETE hapus org node
app.delete("/org/:id", (req, res) => {
  const id = Number(req.params.id);
  org = org.filter(n => n.id !== id);
  res.json({ message: "Node berhasil dihapus" });
});

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});