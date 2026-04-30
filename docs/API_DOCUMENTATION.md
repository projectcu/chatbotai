# Chatbot API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/*` and `/chat/session`) require a Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Chat Endpoints

### 1. Create Session
**POST** `/chat/session`

Creates a new chat session.

**Request:**
```json
{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-xxxxx",
  "conversationId": "mongodb-id"
}
```

---

### 2. Send Message
**POST** `/chat/message`

Process user message and get bot response.

**Request:**
```json
{
  "userId": "user-123",
  "sessionId": "session-id",
  "message": "I want to book an appointment"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session-id",
  "response": "I'd be happy to help! When would you like to schedule?",
  "intent": "appointment_booking",
  "confidence": 0.92,
  "entities": {
    "date": ["tomorrow"],
    "time": ["3 PM"]
  }
}
```

---

### 3. Get Conversation History
**GET** `/chat/history/:sessionId`

Retrieve all messages in a conversation.

**Response:**
```json
{
  "success": true,
  "sessionId": "session-id",
  "messages": [
    {
      "type": "user",
      "content": "Hello",
      "timestamp": "2024-04-28T10:00:00Z"
    },
    {
      "type": "bot",
      "content": "Hi! How can I help?",
      "timestamp": "2024-04-28T10:00:01Z",
      "confidence": 0.95
    }
  ],
  "status": "active"
}
```

---

### 4. Submit Feedback
**POST** `/chat/feedback`

Submit user satisfaction rating.

**Request:**
```json
{
  "sessionId": "session-id",
  "rating": 5,
  "comment": "Very helpful!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

---

### 5. Escalate to Agent
**POST** `/chat/escalate`

Request escalation to human agent.

**Request:**
```json
{
  "sessionId": "session-id",
  "reason": "Need human assistance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Escalated to live agent",
  "sessionId": "session-id"
}
```

---

## Authentication Endpoints

### 1. Register
**POST** `/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Verify Token
**POST** `/auth/verify`

**Request:**
```json
{
  "token": "jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Admin Endpoints

### 1. Get All Intents
**GET** `/admin/intents`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "intents": [
    {
      "_id": "id",
      "name": "greeting",
      "category": "engagement",
      "trainingPhrases": ["hello", "hi", "hey"],
      "responses": ["Hello! How can I help?"],
      "confidence_threshold": 0.7
    }
  ]
}
```

---

### 2. Create Intent
**POST** `/admin/intents`

Requires: `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "greeting",
  "category": "engagement",
  "trainingPhrases": ["hello", "hi", "hey"],
  "responses": ["Hello! How can I help?"],
  "entities": ["greeting_type"],
  "confidence_threshold": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Intent created successfully",
  "intent": { ...intent object... }
}
```

---

### 3. Update Intent
**PUT** `/admin/intents/:id`

Requires: `Authorization: Bearer <token>`

Same request/response format as Create Intent.

---

### 4. Delete Intent
**DELETE** `/admin/intents/:id`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Intent deleted successfully"
}
```

---

### 5. Test Intent
**POST** `/admin/test-intent`

Requires: `Authorization: Bearer <token>`

**Request:**
```json
{
  "message": "I want to book an appointment"
}
```

**Response:**
```json
{
  "success": true,
  "input": "I want to book an appointment",
  "result": {
    "intent": "appointment_booking",
    "confidence": 0.92,
    "entities": {
      "date": ["appointment"]
    }
  }
}
```

---

## Analytics Endpoints

### 1. Get Summary
**GET** `/analytics/summary`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "period": "30 days",
  "summary": {
    "totalConversations": 150,
    "avgConversationLength": 5,
    "successRate": 87,
    "avgResponseTime": 145,
    "topIntents": [
      { "intent": "greeting", "count": 50 }
    ]
  }
}
```

---

### 2. Get Trends
**GET** `/analytics/trends?period=7`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "period": "7 days",
  "trends": [
    {
      "date": "2024-04-28",
      "conversations": 25,
      "successRate": 85,
      "avgResponseTime": 150
    }
  ]
}
```

---

### 3. Get User Ratings
**GET** `/analytics/user-ratings`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "totalRatings": 45,
  "averageRating": 4.2,
  "distribution": {
    "1": 2,
    "2": 3,
    "3": 5,
    "4": 15,
    "5": 20
  }
}
```

---

## Agent Endpoints

### 1. Get Queue
**GET** `/agents/queue`

Requires: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "queueLength": 3,
  "conversations": [...]
}
```

---

### 2. Accept Conversation
**POST** `/agents/accept`

**Request:**
```json
{
  "sessionId": "session-id",
  "agentId": "agent-123"
}
```

---

### 3. Send Message (Agent)
**POST** `/agents/message`

**Request:**
```json
{
  "sessionId": "session-id",
  "agentId": "agent-123",
  "message": "Thank you for waiting..."
}
```

---

### 4. Close Conversation
**POST** `/agents/close`

**Request:**
```json
{
  "sessionId": "session-id"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "status": 400
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

---

## WebSocket Events

The system supports real-time chat via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:5000');

// Send message
ws.send(JSON.stringify({
  type: 'message',
  data: { message: 'Hello' }
}));

// Receive response
ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
};
```

---

## Rate Limiting

API endpoints are rate-limited to 100 requests per minute per IP address.

---

**Last Updated**: April 28, 2026  
**Version**: 1.0
