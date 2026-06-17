const express = require("express");
const router = express.Router();
const {
  getOrg,
  createOrgNode,
  updateOrgNode,
  deleteOrgNode
} = require("../controllers/orgController");

router.get("/", getOrg);
router.post("/", createOrgNode);
router.put("/:id", updateOrgNode);
router.delete("/:id", deleteOrgNode);

module.exports = router;