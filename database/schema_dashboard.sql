-- ============================================
-- TAMBAHAN KOLOM DI TABEL employees (yang sudah ada)
-- ============================================
ALTER TABLE employees
  ADD COLUMN gender ENUM('Male', 'Female') DEFAULT 'Male' AFTER name,
  ADD COLUMN birth_date DATE NULL AFTER gender,
  ADD COLUMN hire_date DATE NULL AFTER birth_date,
  ADD COLUMN resign_date DATE NULL AFTER hire_date,
  ADD COLUMN branch VARCHAR(50) DEFAULT 'Jakarta' AFTER department,
  ADD COLUMN job_level ENUM('Staff','Supervisor','Manager') DEFAULT 'Staff' AFTER position,
  ADD COLUMN performance_score INT DEFAULT 75 AFTER status,
  ADD COLUMN potential_score INT DEFAULT 75 AFTER performance_score;

-- ============================================
-- TABEL BARU: resignations (data resign + alasan)
-- ============================================
CREATE TABLE resignations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  resign_date DATE NOT NULL,
  resign_type ENUM('Voluntary', 'Involuntary') DEFAULT 'Voluntary',
  reason VARCHAR(255),
  tenure_months INT,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- ============================================
-- TABEL BARU: vacancies (lowongan/rekrutmen)
-- ============================================
CREATE TABLE vacancies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status ENUM('Open', 'Filled', 'Cancelled') DEFAULT 'Open',
  opened_date DATE NOT NULL,
  filled_date DATE NULL,
  applied_count INT DEFAULT 0,
  screening_count INT DEFAULT 0,
  interview_count INT DEFAULT 0,
  offer_count INT DEFAULT 0,
  hired_count INT DEFAULT 0,
  source ENUM('Jobstreet', 'LinkedIn', 'Referral', 'Website') DEFAULT 'Jobstreet'
);
