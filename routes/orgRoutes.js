const express = require("express");
const router = express.Router();
const {
  getOrg,
  createOrgNode,
  updateOrgNode,
  deleteOrgNode
} = require("../controllers/orgController");
const {
  validateCreateOrg,
  validateUpdateOrg
} = require("../middlewares/validateOrg");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// Semua role yang login bisa lihat data
router.get("/", verifyToken, getOrg);

// Hanya admin & hr yang bisa tambah/edit
router.post("/", verifyToken, checkRole("admin", "hr"), validateCreateOrg, createOrgNode);
router.put("/:id", verifyToken, checkRole("admin", "hr"), validateUpdateOrg, updateOrgNode);

// Hanya admin yang bisa hapus
router.delete("/:id", verifyToken, checkRole("admin"), deleteOrgNode);

module.exports = router;
