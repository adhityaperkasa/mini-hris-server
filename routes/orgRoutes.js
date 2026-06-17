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

router.get("/", getOrg);
router.post("/", validateCreateOrg, createOrgNode);
router.put("/:id", validateUpdateOrg, updateOrgNode);
router.delete("/:id", deleteOrgNode);

module.exports = router;