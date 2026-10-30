import React, { useState, useEffect, useMemo } from 'react';

const COLLEGE_NAME = 'Vignana Bharathi Engineering College (VBIT)';
const COLLEGE_SHORT = 'VBIT';

const INITIAL_DATA = {
  collegeName: COLLEGE_NAME,
  academicYear: '2026-2027',
  allowTeacherEditLocked: true,
  departments: [
    { id: 'CSE', code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. R. Venkatraman' },
    { id: 'ECE', code: 'ECE', name: 'Electronics & Communication Engg.', hod: 'Dr. S. Meenakshi' },
    { id: 'AIML', code: 'AIML', name: 'AI & Machine Learning', hod: 'Dr. K. Harish' }
  ],
  subjects: [
    { id: 'CS501', code: 'CS501', name: 'Database Management Systems', dept: 'CSE', semester: 5, credits: 4, teacherId: 'TCH101' },
    { id: 'CS502', code: 'CS502', name: 'Operating Systems', dept: 'CSE', semester: 5, credits: 4, teacherId: 'TCH102' },
    { id: 'CS503', code: 'CS503', name: 'Computer Networks', dept: 'CSE', semester: 5, credits: 4, teacherId: 'TCH102' },
    { id: 'CS504', code: 'CS504', name: 'Full Stack Web Development', dept: 'CSE', semester: 5, credits: 3, teacherId: 'TCH101' }
  ],
  teachers: [
    { id: 'TCH101', password: 'password123', name: 'Prof. Ananya Rao', dept: 'CSE', email: 'ananya.cse@vbit.ac.in', designation: 'Associate Professor' },
    { id: 'TCH102', password: 'password123', name: 'Dr. Vikramaditya Nair', dept: 'CSE', email: 'vikram.cse@vbit.ac.in', designation: 'Assistant Professor' }
  ],
  students: [
    { rollNo: '24CSE101', password: 'password123', name: 'Konka Siddhartha', dept: 'CSE', semester: 5, section: 'A', email: '24cse101@vbit.ac.in', phone: '9123456780' },
    { rollNo: '24CSE102', password: 'password123', name: 'Nithya Sri', dept: 'CSE', semester: 5, section: 'A', email: '24cse102@vbit.ac.in', phone: '9123456781' },
    { rollNo: '24CSE103', password: 'password123', name: 'Manideep Varma', dept: 'CSE', semester: 5, section: 'A', email: '24cse103@vbit.ac.in', phone: '9123456782' },
    { rollNo: '24CSE104', password: 'password123', name: 'Geetha Madhuri', dept: 'CSE', semester: 5, section: 'A', email: '24cse104@vbit.ac.in', phone: '9123456783' },
    { rollNo: '24CSE105', password: 'password123', name: 'Siddu Kiran', dept: 'CSE', semester: 5, section: 'A', email: '24cse105@vbit.ac.in', phone: '9123456784' }
  ],
  attendance: {
    '24CSE101_CS501_2026-10-25': 'Present',
    '24CSE101_CS501_2026-10-26': 'Present',
    '24CSE101_CS501_2026-10-27': 'Present',
    '24CSE101_CS501_2026-10-28': 'On Duty',
    '24CSE101_CS502_2026-10-25': 'Present',
    '24CSE101_CS502_2026-10-26': 'Absent',
    '24CSE101_CS502_2026-10-27': 'Present',
    '24CSE101_CS502_2026-10-28': 'Present',
    '24CSE101_CS503_2026-10-25': 'Present',
    '24CSE101_CS503_2026-10-26': 'Present',
    '24CSE101_CS503_2026-10-27': 'Present',
    '24CSE101_CS504_2026-10-25': 'Present',
    '24CSE101_CS504_2026-10-26': 'Present',
    '24CSE102_CS501_2026-10-25': 'Present',
    '24CSE102_CS501_2026-10-26': 'Present',
    '24CSE102_CS501_2026-10-27': 'Present',
    '24CSE103_CS501_2026-10-25': 'Absent',
    '24CSE103_CS501_2026-10-26': 'Absent',
    '24CSE103_CS501_2026-10-27': 'Present',
    '24CSE104_CS501_2026-10-25': 'Present',
    '24CSE104_CS501_2026-10-26': 'Present',
    '24CSE105_CS501_2026-10-25': 'Absent',
    '24CSE105_CS501_2026-10-26': 'Present'
  },
  marks: {
    '24CSE101_CS501': { ia1: 14, ia2: 14, assignment: 10, practical: 9, semesterExam: 45 },
    '24CSE101_CS502': { ia1: 13, ia2: 12, assignment: 9, practical: 9, semesterExam: 42 },
    '24CSE101_CS503': { ia1: 14, ia2: 13, assignment: 10, practical: 8, semesterExam: 44 },
    '24CSE101_CS504': { ia1: 15, ia2: 15, assignment: 10, practical: 10, semesterExam: 47 },
    '24CSE102_CS501': { ia1: 14, ia2: 13, assignment: 9, practical: 9, semesterExam: 43 },
    '24CSE103_CS501': { ia1: 9, ia2: 10, assignment: 7, practical: 7, semesterExam: 30 },
    '24CSE104_CS501': { ia1: 13, ia2: 14, assignment: 9, practical: 8, semesterExam: 40 },
    '24CSE105_CS501': { ia1: 11, ia2: 11, assignment: 8, practical: 8, semesterExam: 35 }
  }
};

function computeGradeInfo(total) {
  if (total >= 90) return { grade: 'O', points: 10, badge: 'success' };
  if (total >= 80) return { grade: 'A+', points: 9, badge: 'primary' };
  if (total >= 70) return { grade: 'A', points: 8, badge: 'info' };
  if (total >= 60) return { grade: 'B+', points: 7, badge: 'secondary' };
  if (total >= 50) return { grade: 'B', points: 6, badge: 'warning' };
  if (total >= 40) return { grade: 'C', points: 5, badge: 'warning' };
  return { grade: 'F', points: 0, badge: 'danger' };
}

export default function App() {
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('vbit_erp_state_v1');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [loginRole, setLoginRole] = useState('admin');
  const [loginId, setLoginId] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState('');

  const [selectedSubject, setSelectedSubject] = useState('CS501');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState('');

  const [newStudent, setNewStudent] = useState({ rollNo: '', name: '', dept: 'CSE', semester: 5, section: 'A', email: '', password: 'password123' });
  const [newTeacher, setNewTeacher] = useState({ id: '', name: '', dept: 'CSE', designation: 'Assistant Professor', email: '', password: 'password123' });
  const [newSubject, setNewSubject] = useState({ id: '', name: '', dept: 'CSE', semester: 5, credits: 4, teacherId: 'TCH101' });

  useEffect(() => {
    localStorage.setItem('vbit_erp_state_v1', JSON.stringify(db));
  }, [db]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const handleRoleSwitch = (role) => {
    setLoginRole(role);
    setAuthError('');
    if (role === 'admin') {
      setLoginId('admin');
      setLoginPassword('admin123');
    } else if (role === 'teacher') {
      setLoginId('TCH101');
      setLoginPassword('password123');
    } else {
      setLoginId('24CSE101');
      setLoginPassword('password123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (loginRole === 'admin') {
      if (loginId === 'admin' && loginPassword === 'admin123') {
        setSession({ role: 'admin', id: 'admin', name: 'VBIT Principal Administrator' });
        setActiveTab('dashboard');
        return;
      }
      setAuthError('Invalid Admin username or password.');
    } else if (loginRole === 'teacher') {
      const t = db.teachers.find((x) => x.id.toUpperCase() === loginId.trim().toUpperCase() && x.password === loginPassword);
      if (t) {
        setSession({ role: 'teacher', id: t.id, name: t.name, dept: t.dept });
        const firstSub = db.subjects.find((s) => s.teacherId === t.id);
        if (firstSub) setSelectedSubject(firstSub.id);
        setActiveTab('dashboard');
        return;
      }
      setAuthError('Invalid Faculty ID or password.');
    } else if (loginRole === 'student') {
      const s = db.students.find((x) => x.rollNo.toUpperCase() === loginId.trim().toUpperCase() && x.password === loginPassword);
      if (s) {
        setSession({ role: 'student', id: s.rollNo, name: s.name, dept: s.dept, semester: s.semester });
        setActiveTab('dashboard');
        return;
      }
      setAuthError('Invalid Student Roll Number or password.');
    }
  };

  const getStudentSubjectAttendance = (rollNo, subjectId) => {
    const prefix = `${rollNo}_${subjectId}_`;
    const entries = Object.entries(db.attendance).filter(([k]) => k.startsWith(prefix));
    const total = entries.length;
    const attended = entries.filter(([, v]) => v === 'Present' || v === 'On Duty').length;
    const percentage = total === 0 ? 100 : Math.round((attended / total) * 100);
    let classesNeeded = 0;
    if (total > 0 && percentage < 75) {
      classesNeeded = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
    }
    return { total, attended, percentage, classesNeeded };
  };

  const getStudentOverallAttendance = (rollNo) => {
    const prefix = `${rollNo}_`;
    const entries = Object.entries(db.attendance).filter(([k]) => k.startsWith(prefix));
    const total = entries.length;
    const attended = entries.filter(([, v]) => v === 'Present' || v === 'On Duty').length;
    const percentage = total === 0 ? 100 : Math.round((attended / total) * 100);
    return { total, attended, percentage };
  };

  const getStudentSubjectMarks = (rollNo, subjectId) => {
    const m = db.marks[`${rollNo}_${subjectId}`] || { ia1: 0, ia2: 0, assignment: 0, practical: 0, semesterExam: 0 };
    const total = Number(m.ia1) + Number(m.ia2) + Number(m.assignment) + Number(m.practical) + Number(m.semesterExam);
    return { ...m, total, ...computeGradeInfo(total) };
  };

  const markAttendance = (rollNo, subjectId, date, status) => {
    const key = `${rollNo}_${subjectId}_${date}`;
    setDb((prev) => ({
      ...prev,
      attendance: { ...prev.attendance, [key]: status }
    }));
  };

  const markAllPresent = () => {
    const updates = {};
    db.students.forEach((st) => {
      updates[`${st.rollNo}_${selectedSubject}_${selectedDate}`] = 'Present';
    });
    setDb((prev) => ({
      ...prev,
      attendance: { ...prev.attendance, ...updates }
    }));
    showToast(`Marked all students Present for ${selectedSubject} on ${selectedDate}`);
  };

  const updateMarks = (rollNo, subjectId, field, value) => {
    const maxMap = { ia1: 15, ia2: 15, assignment: 10, practical: 10, semesterExam: 50 };
    const clamped = Math.max(0, Math.min(maxMap[field], Number(value) || 0));
    const key = `${rollNo}_${subjectId}`;
    setDb((prev) => {
      const existing = prev.marks[key] || { ia1: 0, ia2: 0, assignment: 0, practical: 0, semesterExam: 0 };
      return {
        ...prev,
        marks: {
          ...prev.marks,
          [key]: { ...existing, [field]: clamped }
        }
      };
    });
  };

  const exportCSVReport = () => {
    const headers = ['College', 'Roll_No', 'Student_Name', 'Department', 'Attendance_%', 'Average_Marks', 'Status'];
    const rows = db.students.map((s) => {
      const att = getStudentOverallAttendance(s.rollNo).percentage;
      const totals = db.subjects.map((sub) => getStudentSubjectMarks(s.rollNo, sub.id).total);
      const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
      return [`"${COLLEGE_NAME}"`, s.rollNo, `"${s.name}"`, s.dept, `${att}%`, avg, att < 75 ? 'LOW_ATTENDANCE_ALERT' : 'ELIGIBLE'].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VBIT_Academic_Report_${db.academicYear}.csv`;
    a.click();
    showToast('Exported VBIT CSV Academic Report!');
  };

  const filteredStudents = useMemo(() => {
    return db.students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [db.students, searchQuery]);

  if (!session) {
    return (
      <div className={darkMode ? 'bg-dark text-light min-vh-100 d-flex align-items-center py-5' : 'bg-light text-dark min-vh-100 d-flex align-items-center py-5'}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={`card erp-card shadow-lg overflow-hidden border-0 ${darkMode ? 'bg-secondary bg-opacity-10 text-light' : 'bg-white'}`}>
                <div className="row g-0">
                  <div className="col-md-6 p-5 text-white d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                    <div>
                      <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2">AY {db.academicYear} • {COLLEGE_SHORT} ERP</span>
                      <h2 className="fw-bold mb-2">{COLLEGE_NAME}</h2>
                      <p className="opacity-75 mb-4">
                        Official Student Attendance & Examination Marks Management System with role-based JWT security, automated <strong className="text-warning">&lt;75% attendance alerts</strong>, and real-time CGPA/Grade calculation.
                      </p>
                      <div className="small bg-dark bg-opacity-25 rounded-3 p-3 mb-3">
                        <div className="fw-bold mb-2 text-warning">Quick 1-Click Demo Credentials:</div>
                        <div>• <strong>Admin:</strong> ID <code>admin</code> / Pass <code>admin123</code></div>
                        <div>• <strong>Teacher:</strong> ID <code>TCH101</code> / Pass <code>password123</code></div>
                        <div>• <strong>Student:</strong> Roll <code>24CSE101</code> / Pass <code>password123</code></div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="button" onClick={() => handleRoleSwitch('admin')} className="btn btn-sm btn-light fw-semibold">Fill Admin</button>
                      <button type="button" onClick={() => handleRoleSwitch('teacher')} className="btn btn-sm btn-light fw-semibold">Fill Teacher</button>
                      <button type="button" onClick={() => handleRoleSwitch('student')} className="btn btn-sm btn-light fw-semibold">Fill Student</button>
                    </div>
                  </div>

                  <div className="col-md-6 p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h4 className="fw-bold mb-0">{COLLEGE_SHORT} Portal Sign In</h4>
                        <small className="text-muted">Vignana Bharathi Engineering College</small>
                      </div>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                      </button>
                    </div>

                    <div className="btn-group w-100 mb-4" role="group">
                      {['admin', 'teacher', 'student'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`btn text-capitalize fw-semibold ${loginRole === r ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleRoleSwitch(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    {authError && <div className="alert alert-danger py-2 small">{authError}</div>}

                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">
                          {loginRole === 'admin' ? 'Admin Username' : loginRole === 'teacher' ? 'Faculty Employee ID' : 'Student Roll Number'}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label small fw-semibold">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
                        Login to {COLLEGE_SHORT} Portal ({loginRole.toUpperCase()}) →
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems =
    session.role === 'admin'
      ? [
          { id: 'dashboard', label: '📊 Executive Dashboard' },
          { id: 'students', label: '🎓 Manage Students' },
          { id: 'teachers', label: '👩‍🏫 Manage Faculty & Subjects' },
          { id: 'attendance', label: '📅 Master Attendance' },
          { id: 'marks', label: '📝 Master Marks & Grades' }
        ]
      : session.role === 'teacher'
      ? [
          { id: 'dashboard', label: '📊 Faculty Overview' },
          { id: 'attendance', label: '✅ Mark Daily Attendance' },
          { id: 'marks', label: '📝 Enter Internal & Sem Marks' }
        ]
      : [
          { id: 'dashboard', label: '📊 My Academic Summary' },
          { id: 'attendance', label: '📅 Subject-Wise Attendance' },
          { id: 'marks', label: '🏆 My Marks & Grade Card' }
        ];

  return (
    <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <nav className={`navbar navbar-expand-lg border-bottom px-4 py-3 no-print ${darkMode ? 'navbar-dark bg-dark border-secondary' : 'navbar-light bg-white'}`}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <span className="badge bg-primary">{COLLEGE_SHORT}</span> {COLLEGE_NAME}
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-info text-dark">AY {db.academicYear}</span>
            <span className="small fw-semibold">
              {session.name} (<span className="text-uppercase text-primary">{session.role}</span>)
            </span>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-sm btn-danger fw-semibold" onClick={() => setSession(null)}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="alert alert-success shadow fw-semibold mb-0">{toast}</div>
        </div>
      )}

      <div className="container-fluid py-4 px-4">
        <div className="row g-4">
          <div className="col-lg-2 no-print">
            <div className={`p-3 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
              <div className="text-uppercase small fw-bold text-muted mb-3 px-2">{COLLEGE_SHORT} Navigation</div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`sidebar-btn ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-sm'
                      : darkMode
                      ? 'bg-transparent text-light'
                      : 'bg-transparent text-dark'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {session.role === 'admin' && (
                <button onClick={exportCSVReport} className="btn btn-outline-success btn-sm w-100 mt-3 fw-semibold">
                  ⬇️ Export VBIT CSV Report
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-10">
            {activeTab === 'dashboard' && session.role !== 'student' && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                      <div className="text-muted small fw-semibold">Total VBIT Students</div>
                      <h2 className="fw-bold mb-0 mt-1">{db.students.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                      <div className="text-muted small fw-semibold">Total Faculty</div>
                      <h2 className="fw-bold mb-0 mt-1">{db.teachers.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                      <div className="text-muted small fw-semibold">Active Subjects</div>
                      <h2 className="fw-bold mb-0 mt-1">{db.subjects.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                      <div className="text-muted small fw-semibold">Below 75% Watchlist</div>
                      <h2 className="fw-bold text-danger mb-0 mt-1">
                        {db.students.filter((s) => getStudentOverallAttendance(s.rollNo).percentage < 75).length}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">{COLLEGE_NAME} — Attendance & Performance Snapshot</h5>
                    <input
                      type="search"
                      className="form-control form-control-sm w-auto"
                      placeholder="Search Roll No or Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className={`table align-middle ${darkMode ? 'table-dark' : 'table-hover'}`}>
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Dept / Sem</th>
                          <th>Overall Attendance</th>
                          <th>Avg Marks</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((st) => {
                          const att = getStudentOverallAttendance(st.rollNo);
                          const avgMarks = Math.round(
                            db.subjects.reduce((acc, sub) => acc + getStudentSubjectMarks(st.rollNo, sub.id).total, 0) /
                              db.subjects.length
                          );
                          return (
                            <tr key={st.rollNo}>
                              <td className="fw-bold">{st.rollNo}</td>
                              <td>{st.name}</td>
                              <td>{st.dept} • Sem {st.semester}</td>
                              <td style={{ minWidth: 180 }}>
                                <div className="d-flex justify-content-between small mb-1">
                                  <span>{att.percentage}%</span>
                                  <span className="text-muted">{att.attended}/{att.total} classes</span>
                                </div>
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className={`progress-bar ${att.percentage < 75 ? 'bg-danger' : 'bg-success'}`}
                                    style={{ width: `${att.percentage}%` }}
                                  />
                                </div>
                              </td>
                              <td className="fw-semibold">{avgMarks} / 100</td>
                              <td>
                                {att.percentage < 75 ? (
                                  <span className="badge bg-danger">⚠️ Low Attendance (&lt;75%)</span>
                                ) : (
                                  <span className="badge bg-success">Eligible</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && session.role === 'admin' && (
              <div className="row g-4">
                <div className="col-md-4">
                  <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                    <h5 className="fw-bold mb-3">Enroll New VBIT Student</h5>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newStudent.rollNo || !newStudent.name) return;
                        setDb((prev) => ({
                          ...prev,
                          students: [...prev.students, { ...newStudent, rollNo: newStudent.rollNo.toUpperCase() }]
                        }));
                        setNewStudent({ rollNo: '', name: '', dept: 'CSE', semester: 5, section: 'A', email: '', password: 'password123' });
                        showToast('Student added successfully!');
                      }}
                    >
                      <div className="mb-2">
                        <label className="form-label small">Roll Number</label>
                        <input className="form-control" value={newStudent.rollNo} onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })} placeholder="e.g. 24CSE106" required />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Full Name</label>
                        <input className="form-control" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Department</label>
                        <select className="form-select" value={newStudent.dept} onChange={(e) => setNewStudent({ ...newStudent, dept: e.target.value })}>
                          {db.departments.map((d) => <option key={d.id} value={d.code}>{d.code} - {d.name}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Default Password</label>
                        <input className="form-control" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} />
                      </div>
                      <button className="btn btn-primary w-100 fw-semibold">Add Student</button>
                    </form>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                    <h5 className="fw-bold mb-3">Enrolled VBIT Students Directory</h5>
                    <table className={`table align-middle ${darkMode ? 'table-dark' : ''}`}>
                      <thead>
                        <tr><th>Roll No</th><th>Name</th><th>Dept</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {db.students.map((s) => (
                          <tr key={s.rollNo}>
                            <td className="fw-bold">{s.rollNo}</td>
                            <td>{s.name}</td>
                            <td>{s.dept} (Sem {s.semester})</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setDb((prev) => ({ ...prev, students: prev.students.filter((x) => x.rollNo !== s.rollNo) }))}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teachers' && session.role === 'admin' && (
              <div className="row g-4">
                <div className="col-md-6">
                  <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                    <h5 className="fw-bold mb-3">Add VBIT Faculty Member</h5>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTeacher.id || !newTeacher.name) return;
                        setDb((prev) => ({ ...prev, teachers: [...prev.teachers, newTeacher] }));
                        setNewTeacher({ id: '', name: '', dept: 'CSE', designation: 'Assistant Professor', email: '', password: 'password123' });
                        showToast('Faculty member added!');
                      }}
                    >
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <input className="form-control" placeholder="ID (TCH103)" value={newTeacher.id} onChange={(e) => setNewTeacher({ ...newTeacher, id: e.target.value.toUpperCase() })} required />
                        </div>
                        <div className="col-8">
                          <input className="form-control" placeholder="Faculty Name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} required />
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm fw-semibold">Add Teacher</button>
                    </form>
                    <hr />
                    <h6>Faculty List</h6>
                    <ul className="list-group list-group-flush">
                      {db.teachers.map((t) => (
                        <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-reset">
                          <span><strong>{t.id}</strong> — {t.name} ({t.dept})</span>
                          <span className="badge bg-secondary">{t.designation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                    <h5 className="fw-bold mb-3">Add / Assign Subject</h5>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newSubject.id || !newSubject.name) return;
                        setDb((prev) => ({ ...prev, subjects: [...prev.subjects, { ...newSubject, code: newSubject.id }] }));
                        setNewSubject({ id: '', name: '', dept: 'CSE', semester: 5, credits: 4, teacherId: 'TCH101' });
                        showToast('Subject created and assigned!');
                      }}
                    >
                      <div className="row g-2 mb-2">
                        <div className="col-4">
                          <input className="form-control" placeholder="Code (CS505)" value={newSubject.id} onChange={(e) => setNewSubject({ ...newSubject, id: e.target.value.toUpperCase() })} required />
                        </div>
                        <div className="col-8">
                          <input className="form-control" placeholder="Subject Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} required />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Assign Teacher</label>
                        <select className="form-select" value={newSubject.teacherId} onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}>
                          {db.teachers.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                        </select>
                      </div>
                      <button className="btn btn-primary btn-sm fw-semibold">Assign Subject</button>
                    </form>
                    <hr />
                    <h6>Assigned Subjects</h6>
                    <ul className="list-group list-group-flush">
                      {db.subjects.map((sub) => (
                        <li key={sub.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-reset">
                          <span><strong>{sub.id}</strong> — {sub.name}</span>
                          <span className="badge bg-primary">Faculty: {sub.teacherId}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && session.role !== 'student' && (
              <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                <div className="row g-3 align-items-end mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Select Subject</label>
                    <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                      {db.subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.id} — {sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Attendance Date (Duplicate-Protected)</label>
                    <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="col-md-4 text-md-end">
                    <button className="btn btn-success fw-semibold" onClick={markAllPresent}>
                      ✅ Mark All Present for {selectedDate}
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className={`table align-middle ${darkMode ? 'table-dark' : 'table-hover'}`}>
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Mark Status ({selectedDate})</th>
                        <th>Subject Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.students.map((st) => {
                        const currentStatus = db.attendance[`${st.rollNo}_${selectedSubject}_${selectedDate}`] || 'Not Marked';
                        const stats = getStudentSubjectAttendance(st.rollNo, selectedSubject);
                        return (
                          <tr key={st.rollNo}>
                            <td className="fw-bold">{st.rollNo}</td>
                            <td>{st.name}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {['Present', 'Absent', 'On Duty'].map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => markAttendance(st.rollNo, selectedSubject, selectedDate, status)}
                                    className={`btn ${
                                      currentStatus === status
                                        ? status === 'Present'
                                          ? 'btn-success'
                                          : status === 'Absent'
                                          ? 'btn-danger'
                                          : 'btn-warning'
                                        : 'btn-outline-secondary'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td style={{ minWidth: 200 }}>
                              <div className="d-flex justify-content-between small mb-1">
                                <span className={stats.percentage < 75 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                  {stats.percentage}%
                                </span>
                                <span className="text-muted">{stats.attended}/{stats.total}</span>
                              </div>
                              <div className="progress" style={{ height: 7 }}>
                                <div className={`progress-bar ${stats.percentage < 75 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${stats.percentage}%` }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'marks' && session.role !== 'student' && (
              <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">VBIT Internal & Semester Examination Marks</h5>
                    <p className="text-muted small mb-0">Auto-computes Total (100M) and Letter Grade (O, A+, A, B+, B, C, F)</p>
                  </div>
                  <select className="form-select w-auto" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    {db.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.id} — {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div className="table-responsive">
                  <table className={`table align-middle ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>IA 1 (15)</th>
                        <th>IA 2 (15)</th>
                        <th>Assign (10)</th>
                        <th>Practical (10)</th>
                        <th>Sem Exam (50)</th>
                        <th>Total (100)</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.students.map((st) => {
                        const m = getStudentSubjectMarks(st.rollNo, selectedSubject);
                        return (
                          <tr key={st.rollNo}>
                            <td className="fw-bold">{st.rollNo}</td>
                            <td>{st.name}</td>
                            {['ia1', 'ia2', 'assignment', 'practical', 'semesterExam'].map((field) => (
                              <td key={field} style={{ width: 95 }}>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={m[field]}
                                  onChange={(e) => updateMarks(st.rollNo, selectedSubject, field, e.target.value)}
                                />
                              </td>
                            ))}
                            <td className="fw-bold fs-6">{m.total}</td>
                            <td>
                              <span className={`badge bg-${m.badge} px-3 py-2`}>{m.grade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {session.role === 'student' && (
              <div>
                {(() => {
                  const overallAtt = getStudentOverallAttendance(session.id);
                  const subjectRows = db.subjects.map((sub) => ({
                    sub,
                    att: getStudentSubjectAttendance(session.id, sub.id),
                    marks: getStudentSubjectMarks(session.id, sub.id)
                  }));
                  const avgScore = Math.round(subjectRows.reduce((a, r) => a + r.marks.total, 0) / subjectRows.length);

                  return (
                    <>
                      {overallAtt.percentage < 75 && (
                        <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm mb-4">
                          <div>
                            <strong>⚠️ VBIT Mandatory 75% Attendance Alert:</strong> Your cumulative attendance is currently{' '}
                            <strong>{overallAtt.percentage}%</strong>. Please attend upcoming lectures regularly to avoid condonation fees.
                          </div>
                        </div>
                      )}

                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                            <div className="text-muted small">{COLLEGE_SHORT} Student Profile</div>
                            <h4 className="fw-bold mb-1">{session.name}</h4>
                            <div className="small text-primary fw-semibold">{session.id} • B.Tech {session.dept} (Sem {session.semester})</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                            <div className="text-muted small">Overall Attendance</div>
                            <h2 className={`fw-bold mb-1 ${overallAtt.percentage < 75 ? 'text-danger' : 'text-success'}`}>
                              {overallAtt.percentage}%
                            </h2>
                            <div className="small text-muted">{overallAtt.attended} of {overallAtt.total} classes attended</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                            <div className="text-muted small">Aggregate Score</div>
                            <h2 className="fw-bold mb-1">{avgScore}%</h2>
                            <div className="small text-muted">Across {db.subjects.length} Registered Subjects</div>
                          </div>
                        </div>
                      </div>

                      {activeTab !== 'marks' && (
                        <div className={`p-4 erp-card mb-4 ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                          <h5 className="fw-bold mb-3">Subject-Wise Attendance & 75% Shortage Calculator</h5>
                          <div className="table-responsive">
                            <table className={`table align-middle ${darkMode ? 'table-dark' : ''}`}>
                              <thead>
                                <tr>
                                  <th>Code</th>
                                  <th>Subject Name</th>
                                  <th>Attended / Total</th>
                                  <th>Attendance Progress</th>
                                  <th>Guidance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subjectRows.map(({ sub, att }) => (
                                  <tr key={sub.id}>
                                    <td className="fw-bold">{sub.code}</td>
                                    <td>{sub.name}</td>
                                    <td>{att.attended} / {att.total}</td>
                                    <td style={{ minWidth: 200 }}>
                                      <div className="progress" style={{ height: 10 }}>
                                        <div
                                          className={`progress-bar ${att.percentage < 75 ? 'bg-danger' : 'bg-success'}`}
                                          style={{ width: `${att.percentage}%` }}
                                        />
                                      </div>
                                      <small className="fw-semibold">{att.percentage}%</small>
                                    </td>
                                    <td>
                                      {att.percentage < 75 ? (
                                        <span className="badge bg-danger">Attend next {att.classesNeeded} classes for 75%</span>
                                      ) : (
                                        <span className="badge bg-success">On Track (≥75%)</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab !== 'attendance' && (
                        <div className={`p-4 erp-card ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <h5 className="fw-bold mb-0">{COLLEGE_NAME} — Semester Grade Card</h5>
                              <small className="text-muted">Student: {session.name} ({session.id})</small>
                            </div>
                            <button className="btn btn-sm btn-outline-primary no-print" onClick={() => window.print()}>
                              🖨️ Print VBIT Grade Card
                            </button>
                          </div>
                          <div className="table-responsive">
                            <table className={`table align-middle ${darkMode ? 'table-dark' : ''}`}>
                              <thead>
                                <tr>
                                  <th>Subject</th>
                                  <th>IA 1 (15)</th>
                                  <th>IA 2 (15)</th>
                                  <th>Assignment (10)</th>
                                  <th>Practical (10)</th>
                                  <th>Semester Exam (50)</th>
                                  <th>Total (100)</th>
                                  <th>Grade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subjectRows.map(({ sub, marks }) => (
                                  <tr key={sub.id}>
                                    <td><strong>{sub.code}</strong> — {sub.name}</td>
                                    <td>{marks.ia1}</td>
                                    <td>{marks.ia2}</td>
                                    <td>{marks.assignment}</td>
                                    <td>{marks.practical}</td>
                                    <td>{marks.semesterExam}</td>
                                    <td className="fw-bold">{marks.total}</td>
                                    <td><span className={`badge bg-${marks.badge} px-3 py-1`}>{marks.grade}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
