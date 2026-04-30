# 🚀 COMPLETE SETUP GUIDE - NEW LAPTOP

## What You Need to Install

For the chatbot to work locally, you need:
1. **Node.js 18** (Runtime for backend, frontend, admin)
2. **MongoDB** (Database)
3. **Redis** (Caching)

Total installation time: ~30 minutes

---

## Step 1: Install Node.js 18 ✅

### Download
Go to: https://nodejs.org/

**Click "18.x.x LTS"** (Long Term Support)
- Not the latest, use LTS for stability

### Install
1. Run the installer
2. Click "Next" through all defaults
3. ✓ Check: "Automatically install necessary tools"
4. Finish and **restart your laptop**

### Verify Installation
Open PowerShell and run:
```powershell
node --version
npm --version
```

Should show:
```
v18.x.x
9.x.x
```

✅ If both show versions, **Node.js is installed!**

---

## Step 2: Install MongoDB Community ✅

### Option A: Local Installation (Recommended)

**Download:**
Go to: https://www.mongodb.com/try/download/community

**Select:**
- Windows x64
- msi installer

**Install:**
1. Run the installer
2. Click "Next" through defaults
3. When asked about "Install MongoDB as a Service" - **keep it checked**
4. Click "Install"
5. Finish

**Start MongoDB:**
```powershell
# MongoDB should auto-start after installation
# Verify it's running:
mongosh
# Should connect without errors
# Type: exit
```

### Option B: MongoDB Atlas (Cloud - Easier)

No local installation needed!

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Use in .env file (see below)

✅ **Pick one option above** (Option A is simpler for testing)

---

## Step 3: Install Redis ✅

### Option A: Using Windows Subsystem for Linux (WSL2)

**Install WSL2:**
```powershell
wsl --install
# Restart your laptop
```

**In WSL terminal:**
```bash
sudo apt update
sudo apt install redis-server
redis-server
# Should show: Ready to accept connections
```

### Option B: Native Windows Build

Download: https://github.com/microsoftarchive/redis/releases

- Download: `Redis-x64-X.X.X.msi`
- Run installer
- Keep all defaults
- Should auto-start

**Verify:**
```powershell
redis-cli ping
# Should respond: PONG
```

✅ **Either option works** (Option A is more reliable)

---

## Step 4: Install Dependencies ✅

### Backend
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
npm install
# Wait for it to finish (2-3 minutes)
```

### Frontend
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\frontend
npm install
# Wait for it to finish (2-3 minutes)
```

### Admin Panel
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\admin-panel
npm install
# Wait for it to finish (2-3 minutes)
```

✅ All dependencies installed!

---

## Step 5: Configure Environment ✅

### Backend Setup
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
```

**Edit .env file:**
```powershell
notepad .env
```

Paste this (replace .env.example content if it exists):
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chatbot
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-secret-key-change-in-production
API_PORT=5000
FRONTEND_URL=http://localhost:3000
ADMIN_PANEL_URL=http://localhost:3001
LOG_LEVEL=info
```

Save (Ctrl+S) and close

✅ Backend configured!

---

## Step 6: Start Everything ✅

**Open 3 PowerShell windows** (not tabs, separate windows):

### Window 1 - MongoDB (Keep Running)
```powershell
# If using local MongoDB, it should auto-start
# Just verify it's running:
mongosh
exit
# If it connects, you're good!
# Keep this command running in background
```

### Window 2 - Redis (Keep Running)
```powershell
# If using WSL:
wsl
redis-server

# If using native Windows:
redis-cli
# Keep running, don't close
```

### Window 3 - Backend API
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
npm run dev
```

Should show:
```
Server running on port 5000
Connected to MongoDB
Redis connected
```

✅ Backend is live!

### Window 4 - Frontend
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\frontend
npm start
```

Should show:
```
webpack compiled
Compiled successfully!
You can now view chatbot in the browser at:
  http://localhost:3000
```

✅ Frontend is live!

### Window 5 - Admin Panel
```powershell
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\admin-panel
npm start
```

Should show:
```
webpack compiled
Compiled successfully!
You can now view admin-panel in the browser at:
  http://localhost:3001
```

✅ Admin panel is live!

---

## Step 7: Test Everything ✅

### Test 1: Health Check
```powershell
curl http://localhost:5000/api/health
# Should return: OK
```

### Test 2: Chat Widget
Open browser:
```
http://localhost:3000
```

You should see:
- Chat widget with welcome message
- Input field
- Try typing: "hello"
- Bot should respond

### Test 3: Admin Panel
Open browser:
```
http://localhost:3001
```

You should see:
- Dashboard with stats
- Intent Manager tab
- Intent Tester tab

### Test 4: Create Chat Session
```powershell
curl -X POST http://localhost:5000/api/chat/session `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"userId":"test_user"}'
```

Should return something like:
```json
{
  "sessionId": "abc123xyz",
  "userId": "test_user"
}
```

### Test 5: Send Message
Replace `SESSION_ID` with the sessionId from Test 4:
```powershell
curl -X POST http://localhost:5000/api/chat/message `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{
    "sessionId":"SESSION_ID",
    "userId":"test_user",
    "message":"hello"
  }'
```

Should return:
```json
{
  "response": "Hello! How can I help you?",
  "intent": "greeting",
  "confidence": 0.95,
  "entities": []
}
```

✅ Everything is working!

---

## 📊 Expected Setup Time

| Step | Time | What You Do |
|------|------|-----------|
| Install Node.js | 5 min | Download & run installer |
| Install MongoDB | 5 min | Download & run installer |
| Install Redis | 5 min | Download & run installer + WSL if needed |
| Install dependencies | 10 min | Run npm install 3 times |
| Configure .env | 2 min | Edit one file |
| Start services | 5 min | Open 5 PowerShell windows |
| Test | 5 min | Run curl commands |
| **TOTAL** | **~40 min** | Full local setup |

---

## ✅ Checklist

- [ ] Node.js installed (`node --version` shows v18.x.x)
- [ ] MongoDB installed and running (`mongosh` connects)
- [ ] Redis installed and running (`redis-cli ping` shows PONG)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Admin dependencies installed (`cd admin-panel && npm install`)
- [ ] .env configured with MongoDB & Redis URLs
- [ ] Backend running on port 5000 (`npm run dev`)
- [ ] Frontend running on port 3000 (`npm start`)
- [ ] Admin running on port 3001 (`npm start`)
- [ ] Health check works (`curl http://localhost:5000/api/health`)
- [ ] Chat widget loads (`http://localhost:3000`)
- [ ] Admin panel loads (`http://localhost:3001`)
- [ ] Can create session and send messages

---

## 🆘 Troubleshooting

### "npm: command not found"
```
→ Node.js not installed or PATH not updated
→ Solution: Download from nodejs.org again, restart laptop
```

### "Cannot connect to MongoDB"
```
→ MongoDB not running
→ Solution: Start MongoDB (auto-starts usually)
→ Check: mongosh command should work
```

### "Cannot connect to Redis"
```
→ Redis not running
→ Solution: Start redis-server (WSL or native)
→ Check: redis-cli ping should return PONG
```

### "Port 5000/3000/3001 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### "EACCES: permission denied"
```
→ Usually from npm global install issues
→ Solution: Run PowerShell as Administrator
```

### "Cannot find module 'express'"
```
→ npm install didn't complete
→ Solution: Delete node_modules, run npm install again
→ Run: rm -r node_modules && npm install
```

---

## 🎯 Quick Reference

### Start Everything (After First Setup)

**Just run these 5 commands in 5 separate PowerShell windows:**

```powershell
# Window 1: Backend
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend && npm run dev

# Window 2: Frontend  
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\frontend && npm start

# Window 3: Admin
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\admin-panel && npm start

# Window 4: Make sure MongoDB is running
mongosh

# Window 5: Make sure Redis is running
redis-server
```

Then access:
- Chat: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000

---

## 📝 Notes

- All services use `localhost` (127.0.0.1)
- Ports: 5000 (API), 3000 (Chat), 3001 (Admin), 27017 (MongoDB), 6379 (Redis)
- Backend logs all requests in its terminal
- Ctrl+C stops any service
- Services auto-reload on code changes
- Data persists in MongoDB even after restart

---

## 🚀 Next Steps (After Setup Works)

1. ✅ Test all features (see Step 7)
2. ✅ Try different messages in chat widget
3. ✅ Add custom intents via admin panel
4. ✅ Review conversations in admin dashboard
5. ✅ When ready to deploy: Follow azure-deployment/DEPLOYMENT_GUIDE.md

---

**Follow these steps and you'll have a fully working chatbot in 40 minutes! 🎉**

Need help with any step? Check [TESTING_START_HERE.md](TESTING_START_HERE.md)
