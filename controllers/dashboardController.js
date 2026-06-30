const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// Helper: bangun klausa filter dinamis dari query params
// Mengembalikan { clause, params } -- clause SELALU diawali "AND ..."
// supaya bisa ditempel setelah WHERE status = 'Active' yang sudah pasti ada
const buildFilterClause = (query) => {
  const conditions = [];
  const params = [];

  if (query.department) {
    conditions.push("department = ?");
    params.push(query.department);
  }
  if (query.branch) {
    conditions.push("branch = ?");
    params.push(query.branch);
  }
  if (query.jobLevel) {
    conditions.push("job_level = ?");
    params.push(query.jobLevel);
  }
  if (query.status) {
    conditions.push("status = ?");
    params.push(query.status);
  }

  const clause = conditions.length ? "AND " + conditions.join(" AND ") : "";
  return { clause, params };
};

// ============================================
// DASHBOARD 1 — EXECUTIVE WORKFORCE
// ============================================
const getExecutiveDashboard = asyncHandler(async (req, res) => {

  const { clause, params } = buildFilterClause(req.query);

  // Kalau user pilih filter "status", jangan dobel dengan WHERE status='Active' default
  const baseWhere = req.query.status ? "WHERE 1=1" : "WHERE status = 'Active'";

  const [kpi] = await db.query(
    `SELECT
      COUNT(*) AS totalHeadcount,
      SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male,
      SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female,
      ROUND(AVG(TIMESTAMPDIFF(YEAR, birth_date, CURDATE())), 1) AS avgAge,
      ROUND(AVG(TIMESTAMPDIFF(MONTH, hire_date, CURDATE())) / 12, 1) AS avgTenure
     FROM employees ${baseWhere} ${clause}`,
    params
  );

  const [vacancy] = await db.query(
    `SELECT COUNT(*) AS vacancy FROM vacancies WHERE status = 'Open'
     ${req.query.department ? "AND department = ?" : ""}`,
    req.query.department ? [req.query.department] : []
  );

  const [headcountTrend] = await db.query(
    `SELECT DATE_FORMAT(hire_date, '%Y-%m') AS month, COUNT(*) AS hc
     FROM employees
     ${baseWhere} AND hire_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) ${clause}
     GROUP BY month ORDER BY month`,
    params
  );

  const [byDepartment] = await db.query(
    `SELECT department, COUNT(*) AS count FROM employees
     ${baseWhere} ${clause}
     GROUP BY department ORDER BY count DESC`,
    params
  );

  const [byBranch] = await db.query(
    `SELECT branch, COUNT(*) AS count FROM employees
     ${baseWhere} ${clause}
     GROUP BY branch ORDER BY count DESC`,
    params
  );

  const [genderDist] = await db.query(
    `SELECT gender, COUNT(*) AS count FROM employees ${baseWhere} ${clause} GROUP BY gender`,
    params
  );

  const [ageDist] = await db.query(
    `SELECT
      CASE
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 25 THEN '<25'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
        ELSE '45+'
      END AS ageGroup,
      COUNT(*) AS count
     FROM employees ${baseWhere} ${clause}
     GROUP BY ageGroup`,
    params
  );

  const [tenureDist] = await db.query(
    `SELECT
      CASE
        WHEN TIMESTAMPDIFF(MONTH, hire_date, CURDATE()) < 12 THEN '<1 Tahun'
        WHEN TIMESTAMPDIFF(MONTH, hire_date, CURDATE()) BETWEEN 12 AND 36 THEN '1-3 Tahun'
        ELSE '>3 Tahun'
      END AS tenureGroup,
      COUNT(*) AS count
     FROM employees ${baseWhere} ${clause}
     GROUP BY tenureGroup`,
    params
  );

  res.json({
    kpi: {
      totalHeadcount: kpi[0].totalHeadcount || 0,
      male: kpi[0].male || 0,
      female: kpi[0].female || 0,
      avgAge: kpi[0].avgAge || 0,
      avgTenure: kpi[0].avgTenure || 0,
      vacancy: vacancy[0].vacancy || 0
    },
    headcountTrend,
    byDepartment,
    byBranch,
    genderDist,
    ageDist,
    tenureDist
  });
});

// ============================================
// DASHBOARD 2 — ATTRITION & RETENTION
// ============================================
const getAttritionDashboard = asyncHandler(async (req, res) => {

  const deptFilter = req.query.department ? "AND e.department = ?" : "";
  const deptFilterParams = req.query.department ? [req.query.department] : [];

  const deptFilterEmp = req.query.department ? "AND department = ?" : "";

  const [totalActive] = await db.query(
    `SELECT COUNT(*) AS total FROM employees WHERE status = 'Active' ${deptFilterEmp}`,
    deptFilterParams
  );

  const [resignSummary] = await db.query(
    `SELECT
      COUNT(*) AS totalResign,
      SUM(CASE WHEN resign_type = 'Voluntary' THEN 1 ELSE 0 END) AS voluntary,
      SUM(CASE WHEN resign_type = 'Involuntary' THEN 1 ELSE 0 END) AS involuntary
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE 1=1 ${deptFilter}`,
    deptFilterParams
  );

  const totalResign = resignSummary[0].totalResign || 0;
  const totalActiveCount = totalActive[0].total || 1;
  const turnoverRate = ((totalResign / (totalActiveCount + totalResign)) * 100).toFixed(1);
  const retentionRate = (100 - turnoverRate).toFixed(1);

  const [resignTrend] = await db.query(
    `SELECT DATE_FORMAT(r.resign_date, '%Y-%m') AS month, COUNT(*) AS count
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE r.resign_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) ${deptFilter}
     GROUP BY month ORDER BY month`,
    deptFilterParams
  );

  const [resignByDept] = await db.query(
    `SELECT e.department, COUNT(*) AS count
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE 1=1 ${deptFilter}
     GROUP BY e.department ORDER BY count DESC`,
    deptFilterParams
  );

  const [resignByTenure] = await db.query(
    `SELECT
      CASE
        WHEN r.tenure_months < 12 THEN '<1 Tahun'
        WHEN r.tenure_months BETWEEN 12 AND 36 THEN '1-3 Tahun'
        ELSE '>3 Tahun'
      END AS tenureGroup,
      COUNT(*) AS count
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE 1=1 ${deptFilter}
     GROUP BY tenureGroup`,
    deptFilterParams
  );

  const [resignByLevel] = await db.query(
    `SELECT e.job_level, COUNT(*) AS count
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE 1=1 ${deptFilter}
     GROUP BY e.job_level`,
    deptFilterParams
  );

  const [highRiskArea] = await db.query(
    `SELECT
      e.department,
      COUNT(r.id) AS resignCount,
      ROUND(COUNT(r.id) / (SELECT COUNT(*) FROM employees e2 WHERE e2.department = e.department) * 100, 1) AS turnoverPercent
     FROM resignations r
     JOIN employees e ON r.employee_id = e.id
     WHERE 1=1 ${deptFilter}
     GROUP BY e.department
     ORDER BY turnoverPercent DESC`,
    deptFilterParams
  );

  res.json({
    kpi: {
      turnoverRate: parseFloat(turnoverRate),
      voluntaryResign: resignSummary[0].voluntary || 0,
      involuntaryResign: resignSummary[0].involuntary || 0,
      retentionRate: parseFloat(retentionRate)
    },
    resignTrend,
    resignByDept,
    resignByTenure,
    resignByLevel,
    highRiskArea
  });
});

// ============================================
// DASHBOARD 3 — RECRUITMENT
// ============================================
const getRecruitmentDashboard = asyncHandler(async (req, res) => {

  const deptFilter = req.query.department ? "AND department = ?" : "";
  const deptFilterParams = req.query.department ? [req.query.department] : [];

  const [kpi] = await db.query(
    `SELECT
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS openVacancy,
      SUM(CASE WHEN status = 'Filled' THEN 1 ELSE 0 END) AS filledVacancy,
      ROUND(AVG(CASE WHEN filled_date IS NOT NULL THEN DATEDIFF(filled_date, opened_date) END)) AS avgTimeToFill
     FROM vacancies WHERE 1=1 ${deptFilter}`,
    deptFilterParams
  );

  const [funnel] = await db.query(
    `SELECT
      SUM(applied_count) AS applied,
      SUM(screening_count) AS screening,
      SUM(interview_count) AS interview,
      SUM(offer_count) AS offer,
      SUM(hired_count) AS hired
     FROM vacancies WHERE 1=1 ${deptFilter}`,
    deptFilterParams
  );

  const totalApplied = funnel[0].applied || 1;
  const totalHired = funnel[0].hired || 0;
  const hiringSuccessRate = ((totalHired / totalApplied) * 100).toFixed(1);

  const [byDepartment] = await db.query(
    `SELECT department, SUM(hired_count) AS hired
     FROM vacancies WHERE 1=1 ${deptFilter}
     GROUP BY department ORDER BY hired DESC`,
    deptFilterParams
  );

  const [bySource] = await db.query(
    `SELECT source, COUNT(*) AS count FROM vacancies WHERE 1=1 ${deptFilter} GROUP BY source`,
    deptFilterParams
  );

  const [timeToFillByPosition] = await db.query(
    `SELECT position, DATEDIFF(filled_date, opened_date) AS days
     FROM vacancies WHERE filled_date IS NOT NULL ${deptFilter}
     ORDER BY days DESC LIMIT 10`,
    deptFilterParams
  );

  const [vacancyAging] = await db.query(
    `SELECT position, department, DATEDIFF(CURDATE(), opened_date) AS daysOpen
     FROM vacancies WHERE status = 'Open' ${deptFilter}
     ORDER BY daysOpen DESC`,
    deptFilterParams
  );

  res.json({
    kpi: {
      openVacancy: kpi[0].openVacancy || 0,
      filledVacancy: kpi[0].filledVacancy || 0,
      avgTimeToFill: kpi[0].avgTimeToFill || 0,
      timeToHire: Math.round((kpi[0].avgTimeToFill || 0) * 0.6),
      hiringSuccessRate: parseFloat(hiringSuccessRate)
    },
    funnel: funnel[0],
    byDepartment,
    bySource,
    timeToFillByPosition,
    vacancyAging
  });
});

// ============================================
// DASHBOARD 4 — PERFORMANCE & TALENT
// ============================================
const getPerformanceDashboard = asyncHandler(async (req, res) => {

  const deptFilter = req.query.department ? "AND department = ?" : "";
  const deptFilterParams = req.query.department ? [req.query.department] : [];

  const [kpi] = await db.query(
    `SELECT
      ROUND(AVG(performance_score)) AS avgScore,
      SUM(CASE WHEN performance_score >= 85 THEN 1 ELSE 0 END) AS highPerformer,
      SUM(CASE WHEN performance_score < 70 THEN 1 ELSE 0 END) AS lowPerformer,
      SUM(CASE WHEN potential_score >= 80 THEN 1 ELSE 0 END) AS highPotential
     FROM employees WHERE status = 'Active' ${deptFilter}`,
    deptFilterParams
  );

  const [distribution] = await db.query(
    `SELECT
      CASE
        WHEN performance_score >= 90 THEN 'Outstanding'
        WHEN performance_score >= 80 THEN 'Exceed'
        WHEN performance_score >= 70 THEN 'Meet'
        ELSE 'Below'
      END AS category,
      COUNT(*) AS count
     FROM employees WHERE status = 'Active' ${deptFilter}
     GROUP BY category`,
    deptFilterParams
  );

  const [byDepartment] = await db.query(
    `SELECT department, ROUND(AVG(performance_score)) AS avgScore
     FROM employees WHERE status = 'Active' ${deptFilter}
     GROUP BY department ORDER BY avgScore DESC`,
    deptFilterParams
  );

  const [topTalent] = await db.query(
    `SELECT empNo, name, performance_score AS score
     FROM employees WHERE status = 'Active' ${deptFilter}
     ORDER BY score DESC LIMIT 10`,
    deptFilterParams
  );

  const [nineBox] = await db.query(
    `SELECT
      id, empNo, name, performance_score AS performance, potential_score AS potential,
      CASE
        WHEN performance_score >= 80 AND potential_score >= 80 THEN 'Future Leader'
        WHEN performance_score >= 80 AND potential_score < 80 THEN 'Key Talent'
        WHEN performance_score < 80 AND potential_score >= 80 THEN 'Solid Performer'
        ELSE 'Under Performer'
      END AS quadrant
     FROM employees WHERE status = 'Active' ${deptFilter}`,
    deptFilterParams
  );

  const [successionReadiness] = await db.query(
    `SELECT position, COUNT(*) AS readySuccessor
     FROM employees
     WHERE status = 'Active' AND job_level = 'Manager' AND performance_score >= 80 ${deptFilter}
     GROUP BY position LIMIT 5`,
    deptFilterParams
  );

  res.json({
    kpi: {
      avgScore: kpi[0].avgScore || 0,
      highPerformer: kpi[0].highPerformer || 0,
      lowPerformer: kpi[0].lowPerformer || 0,
      highPotential: kpi[0].highPotential || 0
    },
    distribution,
    byDepartment,
    topTalent,
    nineBox,
    successionReadiness
  });
});

// ============================================
// FILTER OPTIONS (untuk dropdown filter di semua dashboard)
// ============================================
const getFilterOptions = asyncHandler(async (req, res) => {
  const [departments] = await db.query(`SELECT DISTINCT department FROM employees ORDER BY department`);
  const [branches] = await db.query(`SELECT DISTINCT branch FROM employees ORDER BY branch`);
  const [jobLevels] = await db.query(`SELECT DISTINCT job_level FROM employees ORDER BY job_level`);

  res.json({
    departments: departments.map(d => d.department),
    branches: branches.map(b => b.branch),
    jobLevels: jobLevels.map(j => j.job_level)
  });
});

module.exports = {
  getExecutiveDashboard,
  getAttritionDashboard,
  getRecruitmentDashboard,
  getPerformanceDashboard,
  getFilterOptions
};
