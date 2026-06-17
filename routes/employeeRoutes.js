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

// Semua endpoint employee sekarang wajib login (pakai verifyToken)
router.get("/", verifyToken, getEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/", verifyToken, createEmployee);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee);

module.exports = router;