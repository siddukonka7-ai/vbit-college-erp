# Vignana Bharathi Engineering College (VBIT) — Attendance & Marks Management System

A complete, production-ready Full-Stack College Attendance and Marks Management System customized for **Vignana Bharathi Engineering College (VBIT)**, built with **React.js (Vite + Bootstrap 5)**, **Node.js + Express.js**, **MySQL**, and **JWT Role-Based Access Control**.

---

## 📁 Project Structure

```
VBIT_College_ERP_FullStack/
├── database/
│   └── schema.sql            # 12-Table MySQL Schema (vbit_erp) + Initial Seed Data
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT Verification & Role-Based Authorization
│   ├── db.js                 # MySQL2 Connection Pool
│   ├── seed.js               # Bcrypt Password Seeder (VBIT Admin, Teachers, Students)
│   ├── server.js             # Express REST API (Auth, Admin, Teacher, Student)
│   ├── .env.example          # Environment Variable Template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Complete Multi-Role VBIT React ERP Portal
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── render.yaml               # Automated Cloud Deployment Blueprint for Render
└── README.md
```

---

## 🔑 Default VBIT Demo Login Credentials

| Role | Identifier / Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Teacher** | `TCH101` or `TCH102` | `password123` |
| **Student** | `24CSE101` to `24CSE105` | `password123` |

---

## 🚀 Step-by-Step Online Cloud Deployment (GitHub + Render + Cloud MySQL)

1. Extract `VBIT_College_ERP_FullStack-v2.zip` and push the files to a **GitHub** repository.
2. Provision a MySQL database on **Aiven** or **Railway** and run `database/schema.sql`.
3. On **Render**, click **New +** → **Blueprint** (or **Static Site** / **Web Service**) and connect your GitHub repository to deploy `vbit-erp-frontend` and `vbit-erp-backend`.
