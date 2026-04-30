# 🧪 TESTING YOUR CHATBOT LOCALLY

## Quick Status

Your chatbot project is ready for testing! You have **two options**:

---

## ⚡ OPTION 1: Docker (Easiest) 

**Install Docker Desktop** → **Run one command** → **Everything works**

### Prerequisites
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and restart Windows
3. Verify: Open PowerShell and run `docker --version`

### Start Testing
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject
docker-compose up
```

### Access Services
- Chat: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000

✅ **That's it!** Docker handles MongoDB, Redis, and all services.

---

## 📦 OPTION 2: Manual Setup (Node.js)

### Prerequisites
1. **Node.js 18** - https://nodejs.org/ (LTS)
2. **MongoDB** - https://www.mongodb.com/try/download/community
3. **Redis** - https://github.com/microsoftarchive/redis/releases

### Install Dependencies
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

### Start 3 Services (3 Terminal Windows)

**Terminal 1 - Backend:**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\backend
npm run dev
# Should see: "Server running on port 5000"
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\frontend
npm start
# Should see: "webpack compiled"
```

**Terminal 3 - Admin:**
```bash
cd c:\Users\ANSIKA\OneDrive\Desktop\cuproject\admin-panel
npm start
# Should see: "webpack compiled"
```

### Access Services
- Chat: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000

---

## ✅ Testing Checklist

Once services are running, test each:

### 1. ✓ Chat Widget
```
Open: http://localhost:3000
- Type: "hello"
- Expect: Bot responds with greeting
- Rate: Click thumbs up/down
```

### 2. ✓ Intent Recognition
Try these messages:
```
- "hello" → greeting
- "help" → support_request
- "book appointment" → appointment_booking
- "order status" → order_status
- "bye" → goodbye
```

### 3. ✓ Admin Panel
```
Open: http://localhost:3001
- Dashboard: See stats & trends
- Intent Manager: View/edit intents
- Intent Tester: Test recognition in real-time
```

### 4. ✓ API Health
```bash
curl http://localhost:5000/api/health
# Should return: OK
```

### 5. ✓ Test Chat API
```bash
# Create session
curl -X POST http://localhost:5000/api/chat/session \
  -H "Content-Type: application/json" \
  -d '{"userId":"test_user"}'

# Send message (replace SESSION_ID)
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID","userId":"test_user","message":"hello"}'
```

---

## 🤖 Automated Testing

If you have Python installed:
```bash
python test_chatbot.py
```

This will automatically test:
- API health
- Frontend/Admin running
- User registration & login
- Chat functionality
- Intent recognition
- Conversation history
- Analytics
- And more...

---

## 📊 Expected Results

After starting services, you should see:

### Chat Widget (localhost:3000)
```
✓ Welcome message appears
✓ Input field is active
✓ Bot responds to messages
✓ Messages appear with timestamps
✓ Feedback buttons work
```

### Admin Panel (localhost:3001)
```
✓ Dashboard loads with stats
✓ Shows conversation count
✓ Shows success rate
✓ Displays 7-day trends
✓ Lists all intents
✓ Intent tester works
```

### API (localhost:5000)
```
✓ Health check: OK
✓ Creates sessions
✓ Processes messages
✓ Returns intent + confidence
✓ Extracts entities
✓ Logs conversations
```

### Backend Terminal
```
✓ "Server running on port 5000"
✓ No error messages
✓ Logs each API request
✓ Shows intent recognition
```

---

## 🚨 Troubleshooting

### "Cannot connect to API"
- Check if backend is running
- Backend should show: "Server running on port 5000"
- Restart: Kill terminal and run `npm run dev` again

### "Cannot connect to MongoDB"
- Docker: Auto-starts (no action needed)
- Manual: Start MongoDB service
- Check: `mongosh` should work

### "Cannot connect to Redis"
- Docker: Auto-starts (no action needed)  
- Manual: Run `redis-server` or `redis-cli ping`

### Frontend/Admin blank screen
- Check browser console (F12)
- Check that API_URL environment variable is correct
- Restart: `npm start`

### Port already in use (5000, 3000, 3001)
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) | Detailed testing guide | 15 min |
| [README.md](README.md) | Project overview | 10 min |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | All API endpoints | 20 min |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Commands & snippets | 5 min |

---

## 🎯 Testing Workflow

### Step 1: Choose Installation Method
- 🐳 **Docker** (recommended) - Fast, isolated
- 📦 **Node.js** (manual) - More control

### Step 2: Install & Start Services
- Follow instructions above
- All should show "running" status

### Step 3: Test Each Component
- Chat widget at localhost:3000
- Admin panel at localhost:3001
- API with curl/Postman

### Step 4: Try Sample Conversations
- Greeting: "hello"
- Support: "I need help"
- Booking: "Can I book an appointment?"
- Status: "What's my order status?"

### Step 5: Check Admin Dashboard
- Verify conversations logged
- See analytics data
- Test intent manager

---

## ✨ Success Criteria

After testing, you should have:
- ✅ Chat widget responding
- ✅ Intent recognition working
- ✅ Admin panel showing data
- ✅ No error messages
- ✅ Response time < 500ms
- ✅ Intents recognized correctly

---

## 🚀 Next Steps

Once testing is complete:

1. **Customize** - Add your own intents via Admin Panel
2. **Train** - Test with real conversations
3. **Deploy** - Follow [Deployment Guide](azure-deployment/DEPLOYMENT_GUIDE.md)
4. **Monitor** - Check analytics dashboard

---

## 💡 Pro Tips

### Faster Setup
Use Docker + `docker-compose up` = 1 minute setup

### Real-World Testing
Test with actual use cases from your business

### Monitor Performance
Watch response times in browser DevTools (F12)

### Check Logs
All requests logged in backend terminal

### Save Test Data
Admin panel shows all conversations

---

## 📞 Need Help?

1. Check [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) for detailed steps
2. See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands
3. Review [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for endpoints
4. Run `python test_chatbot.py` for automated testing

---

**Ready to test? Start with Docker for fastest setup! 🚀**

```bash
docker-compose up
# Then open: http://localhost:3000
```
