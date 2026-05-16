# Team Task Manager - Full Stack Application

A modern, full-featured team task management application built with React and FastAPI. Manage projects, assign tasks, track progress, and collaborate with your team with role-based access control.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication** - Secure signup/login with JWT tokens
- ✅ **Project Management** - Create, update, and delete projects
- ✅ **Task Management** - Create, assign, and track tasks
- ✅ **Team Collaboration** - Add team members to projects with role-based access
- ✅ **Dashboard** - Real-time statistics and task overview
- ✅ **Status Tracking** - Pending, In Progress, Completed statuses
- ✅ **Priority Levels** - Low, Medium, High priority tasks
- ✅ **Filtering** - Filter tasks by status, priority, and assignment

### Technical Highlights
- 🔐 **Role-Based Access Control** - Admin and Member roles
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Real-time Updates** - Instant feedback on actions
- 🗄️ **SQL Database** - SQLite (development), PostgreSQL (production)
- 🔄 **Token Refresh** - Automatic token refresh mechanism
- 🎨 **Modern UI** - Tailwind CSS with smooth animations

## 📋 Project Structure

```
team-task-manager/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py         # Authentication routes
│   │   │   │   ├── users.py        # User management
│   │   │   │   ├── projects.py     # Project routes
│   │   │   │   ├── tasks.py        # Task routes
│   │   │   │   └── dashboard.py    # Dashboard statistics
│   │   │   └── api.py
│   │   ├── core/
│   │   │   ├── config.py           # Configuration
│   │   │   ├── security.py         # JWT & password utilities
│   │   │   └── dependencies.py     # Dependency injection
│   │   ├── database/
│   │   │   ├── session.py          # Database session
│   │   │   └── base.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   └── team_member.py
│   │   └── schemas/
│   │       └── schemas.py          # Pydantic models
│   ├── main.py                     # App entry point
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                        # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProjectsPage.jsx
    │   │   ├── ProjectDetailPage.jsx
    │   │   └── TasksPage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   └── api.js              # Axios API client
    │   ├── store/
    │   │   ├── authStore.js        # Authentication state
    │   │   ├── projectStore.js     # Projects state
    │   │   └── taskStore.js        # Tasks state
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (Backend)
- Node.js 16+ (Frontend)
- npm or yarn
- SQLite (included) or PostgreSQL (optional)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run server**
   ```bash
   python main.py
   # Or
   uvicorn main:app --reload
   ```

Backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default is http://localhost:8000/api/v1)
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/` - List all users (admin only)
- `GET /api/v1/users/{user_id}` - Get user by ID

### Projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - List user's projects
- `GET /api/v1/projects/{project_id}` - Get project details
- `PUT /api/v1/projects/{project_id}` - Update project
- `DELETE /api/v1/projects/{project_id}` - Delete project
- `POST /api/v1/projects/{project_id}/members` - Add team member
- `GET /api/v1/projects/{project_id}/members` - List team members
- `DELETE /api/v1/projects/{project_id}/members/{user_id}` - Remove member

### Tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - List tasks (with filters)
- `GET /api/v1/tasks/{task_id}` - Get task details
- `PUT /api/v1/tasks/{task_id}` - Update task
- `DELETE /api/v1/tasks/{task_id}` - Delete task

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

## 📊 Database Models

### User
```
- id: UUID (Primary Key)
- email: String (Unique)
- username: String (Unique)
- full_name: String
- hashed_password: String
- role: Enum (admin, member)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

### Project
```
- id: UUID (Primary Key)
- name: String
- description: Text
- owner_id: UUID (Foreign Key)
- status: String (active, inactive)
- created_at: DateTime
- updated_at: DateTime
```

### Task
```
- id: UUID (Primary Key)
- title: String
- description: Text
- project_id: UUID (Foreign Key)
- assigned_to_id: UUID (Foreign Key)
- status: Enum (pending, in_progress, completed)
- priority: Enum (low, medium, high)
- due_date: DateTime (Optional)
- created_at: DateTime
- updated_at: DateTime
```

### TeamMember
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- project_id: UUID (Foreign Key)
- role: Enum (admin, member)
- joined_at: DateTime
```

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User logs in with email and password
2. Server returns access_token and refresh_token
3. Client includes access_token in Authorization header
4. Token expires after 24 hours
5. Client uses refresh_token to get new access_token

### Role-Based Access Control
- **Admin**: Full access to all features
- **Member**: Can view assigned projects and tasks

### Project Access
- Project owner has full control
- Team members can only access if added to project
- Admin members can manage project tasks
- Regular members have read-only access (can be extended)

## 🌐 Deployment

### Deployment to Railway

1. **Create Railway account** at https://railway.app

2. **Prepare backend**
   ```bash
   # Create Procfile
   echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > backend/Procfile
   ```

3. **Deploy backend**
   - Connect GitHub repository
   - Select `backend` directory
   - Set environment variables in Railway dashboard
   - Set `DATABASE_URL` to PostgreSQL connection string

4. **Deploy frontend**
   - Create new service in Railway
   - Connect GitHub
   - Set build command: `npm install && npm run build`
   - Set start command: Configure for static hosting
   - Set `VITE_API_URL` to deployed backend URL

5. **Configure environment variables**
   ```
   Backend:
   - DATABASE_URL=postgresql://...
   - SECRET_KEY=your-secret-key
   - ALLOWED_ORIGINS=https://your-frontend-url
   
   Frontend:
   - VITE_API_URL=https://your-backend-url/api/v1
   ```

## 📝 Demo Credentials

For testing, use these credentials:

```
Email: admin@example.com
Password: password123
```

## 🧪 Testing the Application

### 1. **User Registration & Login**
   - Sign up with new account
   - Login with credentials
   - Verify JWT token in localStorage

### 2. **Project Management**
   - Create a project
   - View project details
   - Add team members
   - Update project info
   - Delete project

### 3. **Task Management**
   - Create tasks within project
   - Assign tasks to team members
   - Update task status (pending → in_progress → completed)
   - Set priority levels
   - Filter tasks by status/priority
   - Delete completed tasks

### 4. **Dashboard**
   - View task statistics
   - Check overdue tasks
   - See assigned tasks
   - Monitor project progress

### 5. **Role-Based Access**
   - Create admin and member accounts
   - Verify admin has full access
   - Verify member has limited access

## 🔧 Configuration

### Backend Configuration (backend/.env)
```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend Configuration (frontend/.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📦 Dependencies

### Backend
- FastAPI 0.109.0
- SQLAlchemy 2.0.25
- Pydantic 2.5.3
- PyJWT 2.8.1
- bcrypt 4.1.2
- python-dotenv 1.0.0

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- Zustand 4.4.1
- Tailwind CSS 3.3.6
- Lucide React Icons
- date-fns 2.30.0

## 🚨 Error Handling

### Common Errors

**401 Unauthorized**
- Invalid or expired token
- Solution: Login again

**403 Forbidden**
- Access denied to resource
- Solution: Check user role and project permissions

**400 Bad Request**
- Validation error
- Solution: Check request payload format

**404 Not Found**
- Resource doesn't exist
- Solution: Verify resource ID

## 📚 API Examples

### Create a Project
```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Project description"}'
```

### Create a Task
```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Task Title",
    "description":"Task description",
    "project_id":"<project_id>",
    "priority":"high"
  }'
```

### Update Task Status
```bash
curl -X PUT http://localhost:8000/api/v1/tasks/<task_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 already in use**: `lsof -i :8000` then `kill -9 <PID>`
- **Database errors**: Delete `app.db` and restart server
- **CORS errors**: Check `ALLOWED_ORIGINS` in .env

### Frontend Issues
- **API not responding**: Verify backend is running
- **Token errors**: Clear localStorage and login again
- **Build errors**: Delete `node_modules` and run `npm install`

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 💡 Tips for Production

1. **Security**
   - Change SECRET_KEY to strong random string
   - Use HTTPS only
   - Set secure CORS origins
   - Use environment variables for sensitive data

2. **Performance**
   - Enable database query caching
   - Implement pagination for large datasets
   - Use CDN for static assets
   - Optimize images

3. **Monitoring**
   - Set up error logging
   - Monitor API response times
   - Track user activity
   - Set up automated backups

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements!

## 📧 Support

For issues, create a GitHub issue or contact the development team.

---

**Built with ❤️ using React + FastAPI**
