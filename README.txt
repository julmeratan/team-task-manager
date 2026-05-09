========================================================================
🚀 TASKFLOW - PREMIUM TEAM TASK MANAGER
========================================================================
Powered by Ethara.ai

TaskFlow is a production-ready team management system designed for 
seamless collaboration, featuring AI-driven insights and a polished UI.

------------------------------------------------------------------------
🌐 LIVE APPLICATION
------------------------------------------------------------------------
The application is live and accessible at:
https://team-task-manager-production-6d56.up.railway.app

------------------------------------------------------------------------
📈 PROJECT ANALYTICS (SAMPLE DATA)
------------------------------------------------------------------------

COMPLETED TASKS    [####################] 850
ACTIVE SPRINTS     [###                 ] 120
PENDING REVIEW     [#                   ] 25
BLOCKED/OVERDUE    [                    ] 5

------------------------------------------------------------------------
🎬 PROFESSIONAL VIDEO DEMONSTRATION
------------------------------------------------------------------------
A comprehensive video demonstration is included in the root directory:
File: demo_recording.webm

The video covers:
1. Scenario 1 & 2: Registration of Admin and Team Members.
2. Scenario 3: Admin POV - AI Widget, Projects, and Task Assignment.
3. Scenario 4: Member POV - Task completion workflow.

------------------------------------------------------------------------
📊 SYSTEM WORKFLOW
------------------------------------------------------------------------

[ Admin Manager ] -> [ Project Creation ] -> [ Task Assignment ]
       |                                           |
       v                                           v
[ Ethara AI Stats ] <--- [ Live Tracking ] <--- [ Team Member ]

------------------------------------------------------------------------
✨ KEY FEATURES
------------------------------------------------------------------------

💎 ROLE-BASED PERMISSIONS
| Feature                | Admin | Member |
|------------------------|-------|--------|
| View Dashboard Stats   |  YES  |  YES   |
| Create Projects        |  YES  |   NO   |
| Create/Assign Tasks    |  YES  |   NO   |
| Update Task Status     |  YES  |  OWN   |
| AI Insights            |  YES  |   NO   |

💎 Branded Ethara AI Widget
- AI-Powered Reports for velocity and performance.
- Premium Aesthetics with custom animations.

🔍 Advanced Task Management
- Live Search filtering by title and description.
- Smart Sorting by Priority, Due Date, and Project.

🛡️ Secure Infrastructure
- JWT Authentication & BCrypt Encryption.
- Role-Based Access Control (RBAC).
- Real-time status transitions.

------------------------------------------------------------------------
🛠 TECH STACK
------------------------------------------------------------------------
- Frontend: React (Vite) + Vanilla CSS (Premium Dark Mode)
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Security: JWT + bcryptjs
- Automation: Playwright

------------------------------------------------------------------------
📂 PROJECT STRUCTURE
------------------------------------------------------------------------
Team Task Manager/
|-- backend/            # Express API Server
|   |-- models/         # User, Project, Task Schemas
|   |-- routes/         # Auth, Dashboard, Task, Project APIs
|   `-- server.js       # Entry point
|-- frontend/           # React Client
|   |-- src/pages/      # Dashboard, Projects, Tasks, Auth
|   `-- src/index.css   # Premium Design System
`-- demo_recording.webm # Professional Demo Video

------------------------------------------------------------------------
⚙️ SETUP & INSTALLATION
------------------------------------------------------------------------

1. Prerequisites:
   - Node.js (v18+)
   - MongoDB (Atlas or Local)

2. Environment Configuration:
   Create a .env file in the backend/ directory with:
   MONGO_URI, JWT_SECRET, NODE_ENV, PORT

3. Installation:
   - cd backend && npm install && npm run dev
   - cd frontend && npm install && npm run dev

Visit https://team-task-manager-production-6d56.up.railway.app to experience TaskFlow live.
(Or visit http://localhost:5173 for local development after following the steps above).

------------------------------------------------------------------------
👤 CREDITS & LICENSE
------------------------------------------------------------------------
Developed for Ethara.ai.
License: MIT
========================================================================
