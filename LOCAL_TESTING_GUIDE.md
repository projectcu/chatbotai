# 🧪 LOCAL TESTING GUIDE

## Prerequisites Check

Before you can test locally, you need:

### Option 1: Using Docker (Recommended)
**Install these:**
1. **Docker Desktop** - https://www.docker.com/products/docker-desktop
   - Includes both Docker and Docker Compose
   - Easiest setup for Windows

2. Verify installation:
```bash
docker --version
docker-compose --version
```

### Option 2: Manual Node.js Setup
**Install these:**
1. **Node.js 18** - https://nodejs.org/
   - Choose LTS (Long Term Support)
   - Includes npm automatically

2. **MongoDB** - https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud version)

3. **Redis** - https://github.com/microsoftarchive/redis/releases
   - Or use WSL2 with `wsl redis-server`

---

## 🚀 Quick Start Options

### FASTEST: Docker Setup (Recommended)

**Step 1: Install Docker Desktop**
- Download: https://www.docker.com/products/docker-desktop
- Install and restart Windows

**Step 2: Run one command**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject
docker-compose up
```

**Step 3: Access services**
- Chat UI: http://localhost:3000
- Admin Panel: http://localhost:3001
- API: http://localhost:5000

**That's it!** Docker handles everything.

---

### MANUAL: Node.js + Local Services

**Step 1: Install Node.js 18**
- Download: https://nodejs.org/
- Run installer
- Verify: `node --version` (should show v18.x)

**Step 2: Install MongoDB locally**
- Download Community Edition
- Run installer and start service
- Or use Atlas (cloud): https://www.mongodb.com/cloud/atlas

**Step 3: Install Redis**
- Option A: Download for Windows
- Option B: Use WSL2: `wsl redis-server`

**Step 4: Install dependencies**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject

# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install

# Admin Panel
cd ..\admin-panel
npm install
```

**Step 5: Create .env file**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
Copy-Item .env.example .env
```

Edit `backend/.env`:
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chatbot
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-secret-key-12345
API_PORT=5000
FRONTEND_URL=http://localhost:3000
ADMIN_PANEL_URL=http://localhost:3001
```

**Step 6: Start services (3 terminal windows)**

Terminal 1 - Backend:
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
npm run dev
# Should see: "Server running on port 5000"
```

Terminal 2 - Frontend:
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\frontend
npm start
# Should see: "webpack compiled"
```

Terminal 3 - Admin Panel:
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\admin-panel
npm start
# Should see: "webpack compiled"
```

---

## ✅ Testing Checklist

After services are running, test each component:

### 1️⃣ Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Expected response: 200 OK
```

### 2️⃣ Test Chat Functionality
```bash
# Create session
curl -X POST http://localhost:5000/api/chat/session \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123"}'

# Response should include sessionId

# Send message (replace SESSION_ID with actual ID)
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "message": "hello",
    "userId": "user123"
  }'

# Response should include:
# - intent (greeting, etc)
# - confidence (0-1)
# - entities (if found)
# - response (bot's message)
```

### 3️⃣ Test Frontend Chat Widget
```
Open browser: http://localhost:3000
- See chat widget
- Type: "hello"
- Expect bot response with intent recognition
- Click thumbs up/down to rate response
```

### 4️⃣ Test Admin Panel
```
Open browser: http://localhost:3001
- See dashboard with stats
- Go to Intent Manager tab
- View all intents
- Try Intent Tester - type messages and see intent recognition
```

### 5️⃣ Test Authentication
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Should return: { token: "JWT_TOKEN", user: {...} }
```

### 6️⃣ Test Intent Recognition
```bash
# Test different intents
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session",
    "message": "I want to book an appointment",
    "userId": "test_user"
  }'

# Expected intent: "appointment_booking"

# Try other intents:
# - "hello" → greeting
# - "bye" → goodbye
# - "I need help" → support_request
# - "I want a refund" → refund_request
```

---

## 🔍 Common Testing Scenarios

### Scenario 1: Basic Chat Flow
1. Open http://localhost:3000
2. Type: "Hi"
3. Bot responds with greeting
4. Type: "Can you help me?"
5. Bot responds with support offer
6. Rate response (thumbs up/down)

### Scenario 2: Intent Recognition
Try different messages:
- "hello" → greeting intent
- "goodbye" → goodbye intent
- "I want to book a meeting" → appointment_booking intent
- "I have a problem" → complaint intent
- "What's my order status?" → order_status intent

### Scenario 3: Admin Panel
1. Open http://localhost:3001
2. View Analytics Dashboard
   - See conversation count
   - See success rate
   - View 7-day trends
3. Go to Intent Manager
   - View all intents (should see 10)
   - Edit an intent (add new training phrase)
   - Save changes
4. Go to Intent Tester
   - Type: "I need help"
   - See intent recognized
   - See entities extracted
   - See confidence score

### Scenario 4: Escalation
1. In chat widget, look for "Connect to Agent" button
2. Click to escalate
3. Chat should show escalation status
4. In admin panel, check agent queue

---

## 📊 Expected Performance

| Metric | Expected | Good | Excellent |
|--------|----------|------|-----------|
| API Response | <500ms | <300ms | <100ms |
| Intent Accuracy | >80% | >90% | >95% |
| UI Load | <3s | <2s | <1s |
| Intent Recognition | Works | Fast | Instant |

---

## 🛠️ Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For Docker: services auto-start
- For manual: start MongoDB first

### Redis Connection Failed
```
Error: ECONNREFUSED 127.0.0.1:6379
```
**Solution**:
- Make sure Redis is running
- For Docker: auto-starts
- For manual: `redis-server` in PowerShell

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### npm start hangs
**Solution**: 
- Ctrl+C to stop
- Run: `npm install` again
- Try: `npm start -- --reset-cache`

---

## 📝 Quick Test Script

Save as `test.ps1` and run:
```powershell
# Test API health
Write-Host "Testing API..."
Invoke-WebRequest http://localhost:5000/api/health

# Test chat message
$body = @{
    sessionId = "test123"
    userId = "user123"
    message = "hello"
} | ConvertTo-Json

Write-Host "Testing chat..."
Invoke-WebRequest -Uri http://localhost:5000/api/chat/message `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## ✨ What to Expect

### Working Features ✅
- Chat widget responds to messages
- Intent recognition shows high confidence
- Entities are extracted correctly
- Admin dashboard shows analytics
- Intent manager works
- User feedback system works
- Bot provides personalized responses

### Performance ✅
- Chat responds in <500ms
- UI is responsive
- Dashboard loads quickly
- Database operations are fast

### Quality ✅
- No error messages in console
- Conversations logged properly
- Analytics data appears
- Admin panel functions smooth

---

## 🎯 Next Steps After Testing

1. ✅ All components working?
   - Proceed to customization

2. ❌ Something not working?
   - Check logs in terminal
   - Review troubleshooting section
   - Check docs/API_DOCUMENTATION.md

3. Ready to deploy?
   - Follow azure-deployment/DEPLOYMENT_GUIDE.md
   - Use docker-compose for easy deployment

---

## 📚 Additional Resources

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Deployment Guide](azure-deployment/DEPLOYMENT_GUIDE.md)

---

**Happy Testing! 🚀**
