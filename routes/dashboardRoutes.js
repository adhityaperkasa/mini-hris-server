const express = require("express");
const router = express.Router();
const {
  getExecutiveDashboard,
  getAttritionDashboard,
  getRecruitmentDashboard,
  getPerformanceDashboard,
  getFilterOptions
} = require("../controllers/dashboardController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/executive", verifyToken, getExecutiveDashboard);
router.get("/attrition", verifyToken, getAttritionDashboard);
router.get("/recruitment", verifyToken, getRecruitmentDashboard);
router.get("/performance", verifyToken, getPerformanceDashboard);
router.get("/filter-options", verifyToken, getFilterOptions);

module.exports = router;
