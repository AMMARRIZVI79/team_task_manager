# Quick Start Guide - Team Task Manager

## 🚀 Fastest Way to Get Started

### Option 1: Using Docker (Recommended for beginners)

```bash
# Clone or extract the project
cd team-task-manager

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Option 2: Manual Setup (Development)

#### Backend Setup (5 minutes)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run server
python main.py
```

#### Frontend Setup (5 minutes)
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Backend is running on: http://localhost:8000
### Frontend is running on: http://localhost:5173

---

## 🔑 Test Credentials

Once running, use these credentials to login:

**Email:** admin@example.com  
**Password:** password123

---

## 📝 First Steps

1. **Login** with the credentials above
2. **Create a Project** - Click "New Project" in the Projects section
3. **Add Team Members** - Go to project details and add collaborators
4. **Create Tasks** - Add tasks to your project
5. **Track Progress** - Update task status and check the dashboard

---

## 🔧 Key Features to Try

### Dashboard
- View task statistics
- See overdue tasks
- Monitor project progress
- Check assigned tasks

### Projects
- Create new projects
- Add team members with roles
- View all project tasks
- Manage project settings

### Tasks
- Create tasks in projects
- Assign to team members
- Set priority levels
- Update status (pending → in progress → completed)
- Filter by status and priority

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

### Frontend shows "Cannot connect to API"
```bash
# Make sure backend is running first
# Check the VITE_API_URL in frontend/.env
# Should be: http://localhost:8000/api/v1
```

### Database errors
```bash
# Delete the database and restart
rm backend/app.db
python main.py
```

### Node modules issues
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📚 API Documentation

Once backend is running, visit: **http://localhost:8000/api/docs**

This provides interactive API documentation where you can:
- View all endpoints
- See request/response examples
- Test API calls directly

---

## 🚀 Deployment to Railway

1. Push code to GitHub
2. Create Railway account at https://railway.app
3. Connect your GitHub repository
4. Configure environment variables:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   ALLOWED_ORIGINS=https://your-frontend-url
   VITE_API_URL=https://your-backend-url/api/v1
   ```
5. Deploy and get live URLs

---

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Review API endpoints documentation at http://localhost:8000/api/docs
- Check browser console for frontend errors
- Check backend logs in terminal

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can login with credentials
- [ ] Can create a project
- [ ] Can create a task
- [ ] Can update task status
- [ ] Dashboard shows statistics

**You're all set! 🎉**
