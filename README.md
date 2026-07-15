# LJ Career Connect 🚀

> Full-Stack MERN College Job Portal for LJ University

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |

## 📁 Project Structure

```
├── client/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Theme context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # Main app with routing
│   └── package.json
│
├── server/               # Express Backend
│   ├── config/           # DB & Cloudinary config
│   ├── controllers/      # Route controllers
│   ├── middleware/        # Auth & error middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Email & seed data
│   └── server.js         # Entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Copy `server/.env.example` to `server/.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong secret key
- `CLOUDINARY_*` - Your Cloudinary credentials
- `SMTP_*` - Your email credentials

### 3. Run Development

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👥 User Roles

| Role | Access |
|------|--------|
| Super Admin | Full system control |
| TPO | Placement management & analytics |
| Coordinator | Department-level management |
| Recruiter | Job posting & hiring |
| Student | Job search & applications |
| Alumni | Job access & mentoring |

## 📊 API Endpoints

| Route | Description |
|-------|------------|
| `/api/auth/*` | Authentication & OTP |
| `/api/jobs/*` | Job CRUD & search |
| `/api/students/*` | Student profiles & applications |
| `/api/recruiter/*` | Company & application management |
| `/api/admin/*` | Admin dashboard & analytics |
| `/api/departments` | Department listing |
| `/api/stats` | Public statistics |

## 🏫 Departments (18+)

Engineering, Computer Applications, MBA, BBA, Commerce, Applied Sciences, Architecture, Pharmacy, Physiotherapy, Polytechnic, Event Management, Media & Communication, Sports Management, Planning, Law, Nursing, Design, Doctoral Program

## 🔒 Security

- JWT token authentication
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS configuration
- Role-based access control
- Account lockout (5 failed attempts)

## 📦 Deployment

- **Frontend**: Vercel (`vercel deploy`)
- **Backend**: Render (Node.js service)
- **Database**: MongoDB Atlas

---

Built with ❤️ for LJ University
