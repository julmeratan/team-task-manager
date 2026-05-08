# TaskFlow - Team Task Manager

A full-stack web application for team project management, task assignment, and progress tracking with role-based access control (Admin/Member).

## 🚀 Live Demo
**Live URL**: [Add your Railway URL here]

## 📸 Features

### Authentication
- **Sign Up / Login** with JWT-based authentication
- Role selection during registration (Admin or Member)

### Dashboard
- Overview of task statistics: Total, Pending, In Progress, Completed, Overdue
- Project count and recent tasks table
- Real-time data from backend API

### Projects (Admin)
- Create, edit, and delete projects
- Add/remove team members to projects
- View all projects with member avatars

### Tasks
- Create tasks with title, description, priority, due date
- Assign tasks to team members
- Filter tasks by project and status
- Inline status updates (Pending → In Progress → Completed)
- Overdue task detection and highlighting

### Role-Based Access Control
| Feature | Admin | Member |
|---------|-------|--------|
| View Dashboard | ✅ | ✅ |
| Create Projects | ✅ | ❌ |
| Create Tasks | ✅ | ❌ |
| Update Task Status | ✅ | ✅ (own tasks) |
| Delete Projects/Tasks | ✅ | ❌ |

## 🛠 Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + bcryptjs
- **Deployment**: Railway

## 📂 Project Structure
```
Team Task Manager/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/ (User, Project, Task)
│   ├── routes/ (auth, projects, tasks, dashboard)
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/ (Sidebar, ProtectedRoute)
│       ├── context/AuthContext.jsx
│       ├── pages/ (Login, Register, Dashboard, Projects, Tasks)
│       ├── utils/api.js
│       └── index.css
└── README.md
```

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd Team-Task-Manager
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

## 🌐 Deployment (Railway)

### Environment Variables (set in Railway dashboard)
| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret |
| `NODE_ENV` | `production` |
| `PORT` | (Railway sets automatically) |

### Deploy Steps
1. Push code to GitHub
2. Connect repo to Railway
3. Set build command: `cd frontend && npm install && npm run build`
4. Set start command: `cd backend && node server.js`
5. Add environment variables
6. Deploy!

## 👤 Author
Built as a Full-Stack assignment project.

## 📄 License
MIT
