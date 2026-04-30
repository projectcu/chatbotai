# Quick Reference & Commands Guide

## 🚀 Quick Start Commands

### Local Development (Using Docker Compose)
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Check lint
npm run lint
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

#### Admin Panel Setup
```bash
cd admin-panel

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📁 Project Directory Structure

```
cuproject/
├── README.md                      # Project overview
├── PROJECT_COMPLETION.md          # Completion summary
├── docker-compose.yml             # Local dev setup
│
├── backend/                       # Node.js API
│   ├── src/
│   │   ├── index.js              # Main server
│   │   ├── routes/               # API endpoints
│   │   ├── services/             # Business logic
│   │   ├── models/               # MongoDB schemas
│   │   ├── nlp/                  # NLP pipeline
│   │   └── middleware/           # Express middleware
│   ├── package.json
│   └── .env.example
│
├── frontend/                      # React web chat
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── store/                # Zustand state
│   │   └── styles/               # CSS files
│   ├── package.json
│   └── public/
│
├── admin-panel/                   # Admin dashboard
│   ├── src/
│   │   └── pages/               # Admin pages
│   └── package.json
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md           # System design
│   ├── WORKFLOW.md               # Message processing
│   ├── API_DOCUMENTATION.md      # API reference
│   ├── RASA_CONFIG.md            # NLP setup
│   └── TESTING_GUIDE.md          # QA guide
│
└── azure-deployment/             # Cloud setup
    ├── DEPLOYMENT_GUIDE.md
    └── Dockerfile
```

---

## 🔌 API Endpoints Quick Reference

### Chat Endpoints
```
POST   /api/chat/session           # Create session
POST   /api/chat/message           # Send message
GET    /api/chat/history/:sessionId # Get history
POST   /api/chat/feedback          # Submit rating
POST   /api/chat/escalate          # Escalate to agent
```

### Auth Endpoints
```
POST   /api/auth/register          # Register user
POST   /api/auth/login             # Login
POST   /api/auth/verify            # Verify token
GET    /api/auth/user/:userId      # Get user
```

### Admin Endpoints
```
GET    /api/admin/intents          # List intents
POST   /api/admin/intents          # Create intent
PUT    /api/admin/intents/:id      # Update intent
DELETE /api/admin/intents/:id      # Delete intent
POST   /api/admin/test-intent      # Test intent
```

### Analytics Endpoints
```
GET    /api/analytics/summary      # Summary stats
GET    /api/analytics/trends       # Trend data
GET    /api/analytics/user-ratings # User ratings
```

### Agent Endpoints
```
GET    /api/agents/queue           # Get queue
POST   /api/agents/accept          # Accept conversation
POST   /api/agents/message         # Send message
POST   /api/agents/close           # Close conversation
```

---

## 🔐 Authentication

### Get JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

### Use Token in Request
```bash
curl -X GET http://localhost:5000/api/admin/intents \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 📊 Database Commands

### MongoDB
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/chatbot

# View collections
show collections

# Query intents
db.intents.find()

# Count conversations
db.conversations.countDocuments()

# View user feedback
db.conversations.find({ satisfaction: { $exists: true } })
```

### Redis
```bash
# Connect to Redis
redis-cli

# View all keys
keys *

# Get session data
get session:sessionId

# Delete key
del key
```

---

## 🛠️ Useful cURL Examples

### Create Intent
```bash
curl -X POST http://localhost:5000/api/admin/intents \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "greeting",
    "category": "engagement",
    "trainingPhrases": ["hello", "hi", "hey"],
    "responses": ["Hello! How can I help?"],
    "confidence_threshold": 0.7
  }'
```

### Test Intent Recognition
```bash
curl -X POST http://localhost:5000/api/admin/test-intent \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to book an appointment"
  }'
```

### Send Chat Message
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "sessionId": "session-id",
    "message": "Hello, how are you?"
  }'
```

### Get Analytics
```bash
curl -X GET http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🐳 Docker Commands

### Build Images
```bash
# Build backend
docker build -t chatbot-api:latest ./backend

# Build frontend
docker build -t chatbot-ui:latest ./frontend

# Build admin panel
docker build -t chatbot-admin:latest ./admin-panel
```

### Run Containers
```bash
# Run backend
docker run -p 5000:5000 chatbot-api:latest

# Run frontend
docker run -p 3000:3000 chatbot-ui:latest

# Run with environment
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/chatbot \
  chatbot-api:latest
```

### Docker Compose
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Scale service
docker-compose up -d --scale backend=3

# Down and clean
docker-compose down -v
```

---

## ☁️ Azure Commands

### Login & Setup
```bash
# Login
az login

# Set subscription
az account set --subscription "subscription-id"

# Create resource group
az group create --name chatbot-rg --location eastus
```

### Create Resources
```bash
# Create App Service Plan
az appservice plan create \
  --name chatbot-plan \
  --resource-group chatbot-rg \
  --sku B1 --is-linux

# Create Web App
az webapp create \
  --resource-group chatbot-rg \
  --plan chatbot-plan \
  --name chatbot-api \
  --runtime "NODE|18-lts"

# Create Cosmos DB
az cosmosdb create \
  --name chatbot-db \
  --resource-group chatbot-rg \
  --kind MongoDB
```

### Deploy
```bash
# Deploy code
az webapp deployment source config-zip \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --src <path-to-zip>

# Set environment variables
az webapp config appsettings set \
  --resource-group chatbot-rg \
  --name chatbot-api \
  --settings MONGODB_URI="<connection-string>"
```

---

## 🧪 Testing Commands

### Run Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Test coverage
npm test -- --coverage

# Specific test file
npm test -- chatService.test.js
```

### Lint Code
```bash
# Check linting
npm run lint

# Fix issues
npm run lint -- --fix
```

---

## 📝 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/chatbot
REDIS_URL=redis://localhost:6379

# NLP
NLP_PROVIDER=rasa
RASA_URL=http://localhost:5005

# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Azure (Production)
AZURE_STORAGE_CONNECTION_STRING=
AZURE_COSMOS_DB_CONNECTION_STRING=
AZURE_COGNITIVE_SERVICES_KEY=
AZURE_REGION=eastus
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

---

## 🚀 Deployment Checklist

- [ ] Configure environment variables
- [ ] Build Docker images
- [ ] Create Azure resources
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Deploy admin panel
- [ ] Configure database
- [ ] Setup monitoring
- [ ] Configure alerts
- [ ] Run smoke tests
- [ ] Train NLP models
- [ ] Load test system
- [ ] Setup CI/CD
- [ ] Configure SSL/TLS
- [ ] Document configurations
- [ ] Train support team

---

## 🔍 Debugging Tips

### Backend Debugging
```bash
# Enable debug logs
NODE_ENV=development DEBUG=chatbot:* npm run dev

# Check port usage
lsof -i :5000

# View server logs
tail -f logs/server.log
```

### Database Debugging
```bash
# Check MongoDB connection
mongo --host localhost --port 27017

# View all databases
show dbs

# Check indexes
db.conversations.getIndexes()
```

### Frontend Debugging
```bash
# Open React DevTools
# Browser console for errors
# Network tab for API calls
# Redux DevTools for state
```

---

## 📞 Common Issues & Solutions

### MongoDB Connection Error
```bash
# Solution: Ensure MongoDB is running
mongod --dbpath /data/db

# Or use Docker
docker run -d -p 27017:27017 mongo:6.0
```

### Port Already in Use
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### CORS Error
```bash
# Add origin to backend
CORS_ORIGIN=http://localhost:3000
```

### Slow Response Time
```bash
# Check MongoDB indexes
db.conversations.getIndexes()

# Check Redis cache hit rate
redis-cli INFO stats
```

---

## 📈 Monitoring & Logs

### View Backend Logs
```bash
# Real-time logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Save to file
docker-compose logs backend > logs.txt
```

### Monitor Resources
```bash
# CPU and memory
docker stats

# Database stats
mongo --eval "db.stats()"

# Redis memory
redis-cli INFO memory
```

---

## 🎯 Performance Optimization

### Database Optimization
```bash
# Create indexes
db.conversations.createIndex({ userId: 1 })
db.conversations.createIndex({ createdAt: 1 })

# Remove old data
db.conversations.deleteMany({ 
  createdAt: { $lt: new Date(Date.now() - 90*24*60*60*1000) }
})
```

### Cache Warming
```bash
# Pre-load frequent intents
redis-cli SET intent:greeting '{"responses":[...]}'
```

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Azure Documentation](https://docs.microsoft.com/azure/)

---

**Last Updated**: April 28, 2026  
**Version**: 1.0
