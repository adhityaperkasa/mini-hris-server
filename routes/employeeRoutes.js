const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// Semua role yang login bisa lihat data
router.get("/", verifyToken, getEmployees);
router.get("/:id", verifyToken, getEmployeeById);

// Hanya admin & hr yang bisa tambah/edit
router.post("/", verifyToken, checkRole("admin", "hr"), createEmployee);
router.put("/:id", verifyToken, checkRole("admin", "hr"), updateEmployee);

// Hanya admin yang bisa hapus
router.delete("/:id", verifyToken, checkRole("admin"), deleteEmployee);

module.exports = router;
