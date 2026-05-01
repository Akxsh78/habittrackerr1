# ⚡ HabitFlow — Full-Stack Habit Tracker

> Build better habits every day with streaks, analytics, badges, and more.

## 🎯 Features

### Core
- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Habit CRUD (Create, Read, Update, Delete)
- ✅ Daily/Weekly habit tracking with streak counting
- ✅ Completion history with calendar view
- ✅ Heatmap (GitHub-style contribution graph)

### Dashboard & Analytics
- 📊 Stats: Total habits, completed today, streaks, completion rate
- 📈 Weekly & Monthly progress charts (Recharts)
- 🎨 Category breakdown (Pie chart)
- 🔥 Activity heatmap for last 365 days

### Gamification
- 🏆 Badge system (7 unique badges)
- ⚡ Points system
- 🔥 Streak tracking (current & longest)

### UX
- 🌙 Dark/Light mode toggle
- 📱 Fully responsive (mobile-first)
- 🔔 Reminder system with notification UI
- 🔍 Search & filter habits
- 🎨 Customizable habit colors & icons
- ✨ Toast notifications
- ⏳ Loading states & skeletons
- 💡 Daily motivational quotes

---

## 🗂️ Project Structure

```
habit-tracker/
├── backend/                    # Node.js + Express API
│   ├── config/                 # DB and other configs
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   └── habitController.js  # CRUD, streaks, stats
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema + bcrypt + JWT
│   │   └── Habit.js            # Habit schema + streak logic
│   ├── routes/
│   │   ├── auth.js
│   │   ├── habits.js
│   │   └── users.js
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React.js app
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/
│   │   │   └── api.js          # Axios API layer
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state management
│   │   └── index.html          # Complete self-contained app
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone & Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

The standalone `frontend/src/index.html` works without any build step —  
just open it in a browser (demo mode) or deploy to Netlify/Vercel.

---

## 🔧 Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/habittracker
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🧠 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/updateprofile` | Update profile |
| PUT | `/api/auth/updatepassword` | Change password |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | Get all habits (with filters) |
| POST | `/api/habits` | Create habit |
| GET | `/api/habits/:id` | Get single habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| POST | `/api/habits/:id/complete` | Toggle completion |
| GET | `/api/habits/stats` | Get dashboard stats |

### Query Params for GET /api/habits
- `?category=Health` — filter by category
- `?frequency=Daily` — filter by frequency
- `?search=meditation` — search by title
- `?archived=true` — show archived habits

---

## 🚢 Deployment

### Backend → Render / Railway

1. Push code to GitHub
2. Connect repo in Render/Railway
3. Set environment variables
4. Deploy!

**Build command:** `npm install`  
**Start command:** `node server.js`

### Frontend → Vercel / Netlify

**Option A: React App**
```bash
cd frontend
npm run build
# Deploy /build folder
```

**Option B: Static HTML**
- Just upload `frontend/src/index.html` to Netlify Drop
- It works standalone with demo data!
- Set `REACT_APP_API_URL` env var to point to your backend

### Database → MongoDB Atlas

1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IPs (0.0.0.0/0 for Render/Railway)
4. Copy connection string to `MONGODB_URI`

---

## 🛡️ Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- Protected routes with auth middleware
- Input validation on all endpoints
- CORS configured per environment
- Error messages don't leak sensitive info

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |
| Charts | Recharts |
| Deployment | Vercel (FE), Render (BE), MongoDB Atlas (DB) |

---

## 📦 Habit Categories

Health · Fitness · Study · Mindfulness · Finance · Social · Creative · Other

## 🏆 Badge System

| Badge | Requirement |
|-------|------------|
| ⭐ Getting Started | 10 completions |
| 🔥 Week Warrior | 7-day streak |
| 👑 Monthly Master | 30-day streak |
| 🏅 Halfway Hero | 50 completions |
| 🏆 Century Completions | 100 completions |
| 💎 Century Club | 100-day streak |

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

*Built with ❤️ using React.js + Node.js + MongoDB*
"# habittrackerr" 
"# habittrackerr1" 
"# habittrackerr1" 
