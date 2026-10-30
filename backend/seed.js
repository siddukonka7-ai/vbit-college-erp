const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seedDatabase() {
  try {
    console.log('Seeding VBIT default accounts...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('password123', 10);
    const studentHash = await bcrypt.hash('password123', 10);

    await pool.query(
      `INSERT IGNORE INTO admins (id, username, password_hash, full_name, email)
       VALUES (1, 'admin', ?, 'Dr. K. Siddhartha (VBIT Principal Admin)', 'admin@vbit.ac.in')`,
      [adminHash]
    );

    await pool.query(
      `INSERT IGNORE INTO teachers (id, employee_id, password_hash, full_name, email, phone, dept_id, designation)
       VALUES
       (1, 'TCH101', ?, 'Prof. Ananya Rao', 'ananya.cse@vbit.ac.in', '9876543210', 1, 'Associate Professor'),
       (2, 'TCH102', ?, 'Dr. Vikramaditya Nair', 'vikram.cse@vbit.ac.in', '9876543211', 1, 'Assistant Professor')`,
      [teacherHash, teacherHash]
    );

    await pool.query(
      `INSERT IGNORE INTO students (id, roll_no, password_hash, full_name, email, phone, dept_id, class_id, semester, section)
       VALUES
       (1, '24CSE101', ?, 'Konka Siddhartha', '24cse101@vbit.ac.in', '9123456780', 1, 1, 5, 'A'),
       (2, '24CSE102', ?, 'Nithya Sri', '24cse102@vbit.ac.in', '9123456781', 1, 1, 5, 'A'),
       (3, '24CSE103', ?, 'Manideep Varma', '24cse103@vbit.ac.in', '9123456782', 1, 1, 5, 'A'),
       (4, '24CSE104', ?, 'Geetha Madhuri', '24cse104@vbit.ac.in', '9123456783', 1, 1, 5, 'A')`,
      [studentHash, studentHash, studentHash, studentHash]
    );

    await pool.query(
      `INSERT IGNORE INTO teacher_assignments (id, teacher_id, subject_id, class_id, academic_year_id)
       VALUES (1, 1, 1, 1, 2), (2, 1, 4, 1, 2), (3, 2, 2, 1, 2), (4, 2, 3, 1, 2)`
    );

    console.log('VBIT Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
