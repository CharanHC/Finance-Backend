# 💰 Finance Data Processing & Access Control Backend

🚀 A **production-ready backend system** for managing financial data with secure authentication, role-based access control, and real-time analytics.

🔗 **Live API:**  
https://finance-backend-9wcg.onrender.com  

🔗 **API Documentation (Swagger):**  
https://finance-backend-9wcg.onrender.com/api/docs  

🔗 **GitHub Repository:**  
https://github.com/CharanHC/Finance-Backend  

---

## 🧠 Project Overview

This project is designed to simulate a **real-world finance backend system** where users can securely manage income/expense records with strict access control.

It demonstrates:
- Scalable backend architecture  
- Secure authentication & authorization  
- Clean code structure  
- Production deployment  

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure user registration & login
- Role-Based Access Control (RBAC)
  - **ADMIN** → Full access  
  - **ANALYST** → Read & analytics  
  - **VIEWER** → Limited read access  

---

### 💸 Financial Records Management
- Create financial records (Income / Expense)
- Fetch records with pagination
- Soft delete support
- Category-based tracking
- Date-based filtering

---

### 📊 Dashboard Analytics
- Total Income calculation  
- Total Expense calculation  
- Net Balance  
- Recent Activity tracking  

---

### ⚙️ Backend Best Practices
- Input validation using **Zod**
- Centralized error handling
- Rate limiting (API protection)
- Secure headers via Helmet
- Logging using Morgan
- Clean modular architecture

---

### 📘 API Documentation
- Fully integrated **Swagger UI**
- Test APIs directly from browser

---

## 🏗️ Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL (Supabase)**
- **Prisma ORM**
- **JWT Authentication**
- **Zod Validation**
- **Swagger (OpenAPI)**

---

## 🔐 Security Features

- JWT token-based authentication  
- Password hashing using bcrypt  
- Role-based authorization  
- Rate limiting to prevent abuse  
- Secure HTTP headers (Helmet)  
- Input validation for all endpoints  

---

## 👨‍💻 User Roles & Permissions

| Role     | Access Level |
|----------|-------------|
| ADMIN    | Full system access |
| ANALYST  | View analytics & data |
| VIEWER   | Limited access |

---

## 🧪 API Testing & Setup

You can test all APIs using Postman or Swagger UI.

Health Check:
GET /

Register User:
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "Test@123"
}

Login:
POST /api/auth/login

Dashboard Summary:
GET /api/dashboard/summary
Authorization: Bearer <token>

Create Record (ADMIN ONLY):
POST /api/records
Authorization: Bearer <admin_token>

Get Records:
GET /api/records
Authorization: Bearer <token>

Default Admin Credentials (Auto Seeded):
Email: admin@finance.local
Password: Admin@123

Local Setup:
git clone https://github.com/CharanHC/Finance-Backend.git
cd Finance-Backend
npm install

Environment Variables (.env):
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@finance.local
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=System Admin
PORT=5000

Run Project:
npm run dev
npm run build
npm start

Project Structure:
src/
├── config/        # Prisma & Swagger config
├── controllers/   # Request handlers
├── middleware/    # Auth, validation, error handling
├── routes/        # API routes
├── services/      # Business logic
├── validators/    # Zod schemas
├── utils/         # Helpers
├── app.ts
└── server.ts
🚀 This project reflects real-world backend engineering practices and is ready for production-scale applications.
