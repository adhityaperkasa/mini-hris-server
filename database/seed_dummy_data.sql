-- ============================================
-- SEED DATA DUMMY UNTUK DASHBOARD
-- Jalankan SETELAH schema_dashboard.sql
-- ============================================

-- Kosongkan dulu employees lama (opsional, comment kalau mau tetap simpan data lama)
-- DELETE FROM employees;

SET @departments = 'Operations,Sales,IT,Finance,HR';
SET @branches = 'Jakarta,Bandung,Surabaya,Semarang,Medan';

-- Generate 200 employee dummy menggunakan stored procedure
DELIMITER $$

DROP PROCEDURE IF EXISTS generate_dummy_employees$$
CREATE PROCEDURE generate_dummy_employees()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE dept VARCHAR(50);
  DECLARE branch_name VARCHAR(50);
  DECLARE gen ENUM('Male','Female');
  DECLARE lvl ENUM('Staff','Supervisor','Manager');
  DECLARE bdate DATE;
  DECLARE hdate DATE;
  DECLARE perf INT;
  DECLARE pot INT;
  DECLARE emp_status VARCHAR(20);
  DECLARE rdate DATE;

  WHILE i <= 200 DO
    SET dept = ELT(FLOOR(1 + RAND() * 5), 'Operations', 'Sales', 'IT', 'Finance', 'HR');
    SET branch_name = ELT(FLOOR(1 + RAND() * 5), 'Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Medan');
    SET gen = IF(RAND() > 0.45, 'Male', 'Female');
    SET lvl = ELT(FLOOR(1 + RAND() * 3), 'Staff', 'Supervisor', 'Manager');
    SET bdate = DATE_SUB(CURDATE(), INTERVAL FLOOR(22 + RAND() * 35) YEAR);
    SET hdate = DATE_SUB(CURDATE(), INTERVAL FLOOR(1 + RAND() * 96) MONTH);
    SET perf = FLOOR(60 + RAND() * 40);
    SET pot = FLOOR(50 + RAND() * 50);

    -- 12% kemungkinan employee ini sudah resign
    IF RAND() < 0.12 THEN
      SET emp_status = 'Inactive';
      SET rdate = DATE_ADD(hdate, INTERVAL FLOOR(3 + RAND() * 48) MONTH);
      IF rdate > CURDATE() THEN
        SET rdate = CURDATE();
      END IF;
    ELSE
      SET emp_status = 'Active';
      SET rdate = NULL;
    END IF;

    INSERT INTO employees
      (empNo, name, gender, birth_date, hire_date, resign_date, department, branch, position, job_level, status, performance_score, potential_score)
    VALUES
      (CONCAT('EMP', LPAD(i + 100, 4, '0')),
       CONCAT('Employee ', i),
       gen,
       bdate,
       hdate,
       rdate,
       dept,
       branch_name,
       CONCAT(dept, ' ', lvl),
       lvl,
       emp_status,
       perf,
       pot);

    -- Kalau resign, catat juga di tabel resignations
    IF emp_status = 'Inactive' THEN
      INSERT INTO resignations (employee_id, resign_date, resign_type, reason, tenure_months)
      VALUES (
        LAST_INSERT_ID(),
        rdate,
        IF(RAND() > 0.15, 'Voluntary', 'Involuntary'),
        ELT(FLOOR(1 + RAND() * 5), 'Better Opportunity', 'Relocation', 'Family Reason', 'Career Change', 'Performance Issue'),
        TIMESTAMPDIFF(MONTH, hdate, rdate)
      );
    END IF;

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL generate_dummy_employees();
DROP PROCEDURE generate_dummy_employees;

-- ============================================
-- SEED DATA VACANCIES (rekrutmen)
-- ============================================

INSERT INTO vacancies (position, department, status, opened_date, filled_date, applied_count, screening_count, interview_count, offer_count, hired_count, source) VALUES
('Sales Executive', 'Sales', 'Filled', '2026-01-05', '2026-02-10', 120, 60, 25, 10, 8, 'Jobstreet'),
('IT Support', 'IT', 'Open', '2026-03-01', NULL, 80, 35, 12, 4, 0, 'LinkedIn'),
('Finance Staff', 'Finance', 'Filled', '2026-02-15', '2026-03-20', 95, 45, 18, 6, 5, 'Referral'),
('HR Recruiter', 'HR', 'Filled', '2026-01-20', '2026-02-25', 60, 30, 14, 5, 4, 'Website'),
('Operations Supervisor', 'Operations', 'Open', '2026-04-01', NULL, 70, 28, 10, 3, 0, 'Jobstreet'),
('Sales Manager', 'Sales', 'Open', '2026-05-01', NULL, 40, 15, 6, 2, 0, 'LinkedIn'),
('IT Manager', 'IT', 'Filled', '2026-01-10', '2026-03-15', 55, 22, 9, 3, 2, 'LinkedIn'),
('Finance Analyst', 'Finance', 'Open', '2026-05-10', NULL, 65, 25, 8, 2, 0, 'Jobstreet'),
('HR Manager', 'HR', 'Open', '2026-04-15', NULL, 30, 12, 5, 1, 0, 'Referral'),
('Operations Staff', 'Operations', 'Filled', '2026-02-01', '2026-02-28', 150, 70, 30, 12, 10, 'Jobstreet');
