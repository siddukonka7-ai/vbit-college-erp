-- ============================================================================
-- VIGNANA BHARATHI ENGINEERING COLLEGE (VBIT)
-- STUDENT ATTENDANCE & MARKS MANAGEMENT SYSTEM
-- Complete Relational MySQL Schema (12 Tables + Initial Seed Data)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS vbit_erp;
USE vbit_erp;

-- 1. Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_label VARCHAR(20) NOT NULL UNIQUE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    hod_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    duration_years INT DEFAULT 4,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 4. Classes / Sections
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    semester INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    class_label VARCHAR(50) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 5. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    dept_id INT NOT NULL,
    semester INT NOT NULL,
    credits INT DEFAULT 4,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 6. Admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Teachers
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20),
    dept_id INT NOT NULL,
    designation VARCHAR(80) DEFAULT 'Assistant Professor',
    can_edit_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 8. Students
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20),
    dept_id INT NOT NULL,
    class_id INT,
    semester INT NOT NULL DEFAULT 5,
    section VARCHAR(10) DEFAULT 'A',
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- 9. Teacher Subject Assignments
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT,
    academic_year_id INT NOT NULL,
    UNIQUE KEY uq_teacher_subject_class (teacher_id, subject_id, academic_year_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 10. Attendance (Prevents duplicate entries per student, subject, and date)
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'On Duty') NOT NULL DEFAULT 'Present',
    marked_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_subject_date (student_id, subject_id, attendance_date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 11. Marks (Internal 1, Internal 2, Assignments, Practical, Semester Exam)
CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    ia1 DECIMAL(5,2) DEFAULT 0 CHECK (ia1 BETWEEN 0 AND 15),
    ia2 DECIMAL(5,2) DEFAULT 0 CHECK (ia2 BETWEEN 0 AND 15),
    assignment DECIMAL(5,2) DEFAULT 0 CHECK (assignment BETWEEN 0 AND 10),
    practical DECIMAL(5,2) DEFAULT 0 CHECK (practical BETWEEN 0 AND 10),
    semester_exam DECIMAL(5,2) DEFAULT 0 CHECK (semester_exam BETWEEN 0 AND 50),
    total_marks DECIMAL(5,2) GENERATED ALWAYS AS (ia1 + ia2 + assignment + practical + semester_exam) STORED,
    grade VARCHAR(5),
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_subject_year (student_id, subject_id, academic_year_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 12. Notifications & Alerts
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_role ENUM('ALL', 'ADMIN', 'TEACHER', 'STUDENT') DEFAULT 'ALL',
    target_user_id INT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'WARNING', 'DANGER', 'SUCCESS') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data
INSERT IGNORE INTO academic_years (id, year_label, is_current) VALUES
(1, '2025-2026', FALSE),
(2, '2026-2027', TRUE);

INSERT IGNORE INTO departments (id, code, name, hod_name) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'Dr. R. Venkatraman'),
(2, 'ECE', 'Electronics & Communication Engineering', 'Dr. S. Meenakshi'),
(3, 'AIML', 'Artificial Intelligence & Machine Learning', 'Dr. K. Harish');

INSERT IGNORE INTO courses (id, dept_id, code, name, duration_years) VALUES
(1, 1, 'BTECH-CSE', 'B.Tech Computer Science & Engineering', 4),
(2, 2, 'BTECH-ECE', 'B.Tech Electronics & Communication', 4),
(3, 3, 'BTECH-AIML', 'B.Tech AI & Machine Learning', 4);

INSERT IGNORE INTO classes (id, course_id, academic_year_id, semester, section, class_label) VALUES
(1, 1, 2, 5, 'A', 'III B.Tech CSE - Sec A'),
(2, 2, 2, 5, 'A', 'III B.Tech ECE - Sec A');

INSERT IGNORE INTO subjects (id, code, name, dept_id, semester, credits) VALUES
(1, 'CS501', 'Database Management Systems', 1, 5, 4),
(2, 'CS502', 'Operating Systems', 1, 5, 4),
(3, 'CS503', 'Computer Networks', 1, 5, 4),
(4, 'CS504', 'Full Stack Web Development', 1, 5, 3),
(5, 'EC501', 'Digital Signal Processing', 2, 5, 4);
