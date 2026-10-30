const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_vbit_jwt_key_2026';

function computeGrade(total) {
  if (total >= 90) return 'O';
  if (total >= 80) return 'A+';
  if (total >= 70) return 'A';
  if (total >= 60) return 'B+';
  if (total >= 50) return 'B';
  if (total >= 40) return 'C';
  return 'F';
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    college: 'Vignana Bharathi Engineering College (VBIT)',
    service: 'VBIT College ERP API',
    timestamp: new Date().toISOString()
  });
});

// 1. AUTHENTICATION (Admin, Teacher, Student)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body;
    if (!role || !identifier || !password) {
      return res.status(400).json({ error: 'Role, login ID, and password are required' });
    }

    let user = null;
    if (role === 'admin') {
      const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [identifier]);
      user = rows[0];
    } else if (role === 'teacher') {
      const [rows] = await pool.query('SELECT * FROM teachers WHERE employee_id = ?', [identifier]);
      user = rows[0];
    } else if (role === 'student') {
      const [rows] = await pool.query('SELECT * FROM students WHERE roll_no = ?', [identifier]);
      user = rows[0];
    } else {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    if (!user) return res.status(401).json({ error: 'Account not found' });

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      id: user.id,
      role,
      identifier: user.username || user.employee_id || user.roll_no,
      name: user.full_name,
      dept_id: user.dept_id || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADMIN ROUTES
app.get('/api/admin/overview', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) AS totalStudents FROM students');
    const [[{ totalTeachers }]] = await pool.query('SELECT COUNT(*) AS totalTeachers FROM teachers');
    const [[{ totalDepts }]] = await pool.query('SELECT COUNT(*) AS totalDepts FROM departments');
    const [[{ attendanceRate }]] = await pool.query(
      `SELECT ROUND( COALESCE(SUM(CASE WHEN status IN ('Present','On Duty') THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 0), 1) AS attendanceRate FROM attendance`
    );
    res.json({ totalStudents, totalTeachers, totalDepts, attendanceRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/students', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { roll_no, password, full_name, email, phone, dept_id, semester, section } = req.body;
    const hash = await bcrypt.hash(password || 'password123', 10);
    const [result] = await pool.query(
      `INSERT INTO students (roll_no, password_hash, full_name, email, phone, dept_id, semester, section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [roll_no, hash, full_name, email, phone, dept_id, semester || 5, section || 'A']
    );
    res.status(201).json({ id: result.insertId, message: 'Student created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/teachers', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { employee_id, password, full_name, email, phone, dept_id, designation } = req.body;
    const hash = await bcrypt.hash(password || 'password123', 10);
    const [result] = await pool.query(
      `INSERT INTO teachers (employee_id, password_hash, full_name, email, phone, dept_id, designation)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, hash, full_name, email, phone, dept_id, designation || 'Assistant Professor']
    );
    res.status(201).json({ id: result.insertId, message: 'Teacher created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. TEACHER ROUTES (Attendance & Marks)
app.post('/api/teacher/attendance', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { subject_id, attendance_date, records } = req.body;
    if (!subject_id || !attendance_date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid attendance payload' });
    }

    for (const item of records) {
      await pool.query(
        `INSERT INTO attendance (student_id, subject_id, attendance_date, status, marked_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)`,
        [item.student_id, subject_id, attendance_date, item.status, req.user.id]
      );
    }
    res.json({ message: 'Attendance saved successfully (duplicate-protected)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/teacher/marks', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { student_id, subject_id, academic_year_id = 2, ia1 = 0, ia2 = 0, assignment = 0, practical = 0, semester_exam = 0 } = req.body;
    const total = Number(ia1) + Number(ia2) + Number(assignment) + Number(practical) + Number(semester_exam);
    const grade = computeGrade(total);

    await pool.query(
      `INSERT INTO marks (student_id, subject_id, academic_year_id, ia1, ia2, assignment, practical, semester_exam, grade, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       ia1 = VALUES(ia1), ia2 = VALUES(ia2), assignment = VALUES(assignment),
       practical = VALUES(practical), semester_exam = VALUES(semester_exam),
       grade = VALUES(grade), updated_by = VALUES(updated_by)`,
      [student_id, subject_id, academic_year_id, ia1, ia2, assignment, practical, semester_exam, grade, req.user.id]
    );

    res.json({ message: 'Marks updated successfully', total, grade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. STUDENT ROUTES (Strictly isolated to req.user.id)
app.get('/api/student/me', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const studentId = req.user.id;
    const [[profile]] = await pool.query(
      `SELECT s.id, s.roll_no, s.full_name, s.email, s.phone, s.semester, s.section, d.code AS dept_code, d.name AS dept_name
       FROM students s JOIN departments d ON s.dept_id = d.id WHERE s.id = ?`,
      [studentId]
    );

    const [attendance] = await pool.query(
      `SELECT a.attendance_date, a.status, sub.code AS subject_code, sub.name AS subject_name
       FROM attendance a JOIN subjects sub ON a.subject_id = sub.id
       WHERE a.student_id = ? ORDER BY a.attendance_date DESC`,
      [studentId]
    );

    const [marks] = await pool.query(
      `SELECT sub.code AS subject_code, sub.name AS subject_name, sub.credits,
              m.ia1, m.ia2, m.assignment, m.practical, m.semester_exam, m.total_marks, m.grade
       FROM marks m JOIN subjects sub ON m.subject_id = sub.id
       WHERE m.student_id = ?`,
      [studentId]
    );

    res.json({ profile, attendance, marks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Vignana Bharathi Engineering College (VBIT) ERP Backend running on port ${PORT}`);
});
