# Setup Instructions

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher
- **Git**: For version control (optional)

## Prerequisites Installation

### Windows
1. Download Python from https://www.python.org/downloads/
2. Download Node.js from https://nodejs.org/
3. Install both with default settings

### macOS
```bash
# Using Homebrew
brew install python@3.11
brew install node
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3.11 python3-pip python3-venv
sudo apt install nodejs npm
```

---

## Backend Setup (FastAPI + SQLAlchemy)

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Setup Environment
```bash
# Copy example environment file
cp .env.example .env

# On Windows
copy .env.example .env
```

### Step 5: Seed Database (Optional - for demo data)
```bash
python seed.py
```

This will create:
- Admin user (admin@example.com / password123)
- Demo user (demo@example.com / password123)
- Sample project with tasks

### Step 6: Start Backend Server
```bash
python main.py
```

The backend will start at **http://localhost:8000**

**Verify it's working:**
- Open http://localhost:8000/api/health in browser
- Visit http://localhost:8000/api/docs for API documentation

---

## Frontend Setup (React + Vite)

### Step 1: Navigate to Frontend (in new terminal)
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This may take a few minutes...

### Step 3: Setup Environment
```bash
# Copy example environment file
cp .env.example .env

# On Windows
copy .env.example .env
```

### Step 4: Start Development Server
```bash
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## Using the Application

### 1. Open in Browser
Navigate to **http://localhost:5173**

### 2. Login with Demo Credentials
```
Email: admin@example.com
Password: password123
```

### 3. Explore Features
- **Dashboard**: View task statistics and overview
- **Projects**: Create and manage projects
- **Tasks**: Create tasks within projects
- **Team**: Add team members to projects

---

## Configuration Files

### Backend Configuration (.env)
```env
# Database
DATABASE_URL=sqlite:///./app.db

# Security
SECRET_KEY=your-secret-key-change-in-production

# JWT Settings
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend Configuration (.env)
```env
# API endpoint
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Troubleshooting

### Backend Issues

**Problem**: "Port 8000 already in use"
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (macOS/Linux)
kill -9 <PID>

# On Windows, use Task Manager or:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Problem**: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall requirements
pip install -r requirements.txt
```

**Problem**: "Database error"
```bash
# Delete the database and restart
rm app.db  # macOS/Linux
del app.db # Windows

# Run seed again
python seed.py

# Start server
python main.py
```

### Frontend Issues

**Problem**: "Cannot GET /"
```bash
# Make sure you're accessing port 5173
http://localhost:5173

# Check if npm dev server is running
# You should see: "VITE v..." in the terminal
```

**Problem**: "Cannot connect to API"
```bash
# Check backend is running (http://localhost:8000/api/health)
# Verify VITE_API_URL in .env is correct
# Check browser console for exact error

# Restart frontend
npm run dev
```

**Problem**: "npm: command not found"
```bash
# Node.js may not be installed or not in PATH
node --version
npm --version

# If not recognized, reinstall Node.js from https://nodejs.org/
```

---

## Database Management

### SQLite (Default - Development)
- Database file: `backend/app.db`
- No additional setup needed
- Good for development and testing

### PostgreSQL (Production)
```bash
# Install PostgreSQL
# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager

# Restart backend
python main.py
```

---

## Building for Production

### Build Backend
```bash
cd backend

# Collect production dependencies
pip freeze > requirements.txt

# The application is ready to deploy
# See Deployment section in README.md
```

### Build Frontend
```bash
cd frontend

# Build for production
npm run build

# This creates a 'dist' folder with optimized files
# Ready for deployment
```

---

## API Testing

### Using cURL
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Create Project
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Test"}'
```

### Using Postman
1. Download from https://www.postman.com/downloads/
2. Import API collection from http://localhost:8000/api/docs
3. Set up environment variables with your tokens
4. Test all endpoints

### Using API Documentation
1. Open http://localhost:8000/api/docs
2. All endpoints are listed with examples
3. Try out requests directly in the browser

---

## Next Steps

1. ✅ **Setup both backend and frontend** (this document)
2. 📝 **Read QUICK_START.md** for first steps
3. 📚 **Review README.md** for full documentation
4. 🚀 **Deploy to Railway** when ready

---

## Support

If you encounter issues:

1. Check this troubleshooting section first
2. Review the error message carefully
3. Check backend logs in terminal
4. Check browser console (F12) for frontend errors
5. Verify all prerequisites are installed
6. Try restarting both servers

---

## Tips for Success

✅ **Do:**
- Activate virtual environment before running backend
- Keep backend and frontend in separate terminals
- Use Chrome/Firefox for best compatibility
- Check terminal for error messages

❌ **Don't:**
- Run pip commands without virtual environment
- Use sudo to install Python packages
- Close the backend/frontend terminals while testing
- Share your SECRET_KEY publicly

---

Happy coding! 🚀
