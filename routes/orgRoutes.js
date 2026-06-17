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

// Semua endpoint org sekarang wajib login (pakai verifyToken)
router.get("/", verifyToken, getOrg);
router.post("/", verifyToken, validateCreateOrg, createOrgNode);
router.put("/:id", verifyToken, validateUpdateOrg, updateOrgNode);
router.delete("/:id", verifyToken, deleteOrgNode);

module.exports = router;