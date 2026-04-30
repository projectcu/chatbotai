# Testing & Quality Assurance Guide

## Testing Strategy

### 1. Unit Tests

#### Backend Tests
```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Test coverage
npm test -- --coverage
```

**Test Files to Create:**
- `backend/src/services/__tests__/chatService.test.js`
- `backend/src/services/__tests__/authService.test.js`
- `backend/src/nlp/__tests__/intentRecognition.test.js`

#### Frontend Tests
```bash
# React component tests
npm test

# Run specific test
npm test -- --testNamePattern="Chat Widget"
```

### 2. Integration Tests

```bash
# Test API endpoints
npm run test:integration

# Test database operations
npm run test:db

# Test NLP pipeline
npm run test:nlp
```

### 3. End-to-End Tests

```bash
# Using Playwright/Cypress
npm run test:e2e

# Specific scenario
npm run test:e2e -- --grep "user sends message and gets response"
```

---

## Accuracy Metrics

### Intent Recognition Accuracy
**Target**: >95%

**Measurement**:
```javascript
// Test 100 sample messages
const testSamples = [
  { message: "Hi there", expectedIntent: "greeting", expectedConfidence: 0.9 },
  { message: "I want to book", expectedIntent: "appointment", expectedConfidence: 0.85 },
  // ... more samples
];

let correctCount = 0;
for (const sample of testSamples) {
  const result = await nlpService.recognizeIntent(sample.message);
  if (result.intent === sample.expectedIntent) correctCount++;
}
const accuracy = (correctCount / testSamples.length) * 100;
console.log(`Accuracy: ${accuracy}%`);
```

### Entity Extraction F1 Score
**Target**: >0.90

Measured using precision and recall:
$$F1 = 2 \times \frac{precision \times recall}{precision + recall}$$

### Response Time
**Target**: <200ms

```javascript
const startTime = Date.now();
const result = await chatService.processMessage(userId, sessionId, message);
const responseTime = Date.now() - startTime;
console.log(`Response time: ${responseTime}ms`);
```

---

## User Testing Checklist

### Functionality Testing
- [ ] User can create account
- [ ] User can login/logout
- [ ] User can send message
- [ ] Bot responds with relevant answer
- [ ] User can request agent escalation
- [ ] User can rate responses
- [ ] Conversation history is saved
- [ ] User can clear chat

### UI/UX Testing
- [ ] Chat interface is responsive
- [ ] Messages are readable
- [ ] Input field is easy to use
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Mobile layout is usable
- [ ] Accessibility features work

### Performance Testing
- [ ] Page loads in <3 seconds
- [ ] Messages send/receive quickly (<200ms)
- [ ] No lag when typing
- [ ] Handles rapid message sending
- [ ] Works on slow connections

### Security Testing
- [ ] Cannot access others' conversations
- [ ] Tokens expire properly
- [ ] SQL injection is prevented
- [ ] XSS attacks are blocked
- [ ] Sensitive data is encrypted

---

## Test Coverage Report

```
File                          | Coverage
------------------------------|----------
chatService.js               | 85%
authService.js               | 90%
intentRecognition.js         | 88%
entityExtraction.js          | 82%
ChatWidget.jsx              | 79%
IntentManager.jsx           | 81%
AnalyticsDashboard.jsx      | 76%
------------------------------|----------
Overall Coverage             | 83%
Target Coverage              | >80%
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: cd backend && npm ci
      
      - name: Run Backend Tests
        run: cd backend && npm test
      
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      
      - name: Run Frontend Tests
        run: cd frontend && npm test
      
      - name: Check Code Quality
        run: npm run lint
      
      - name: Build Artifacts
        run: npm run build
```

---

## Load Testing

### Performance Benchmarks

Using Apache JMeter:

```bash
# Simulate 100 concurrent users
jmeter -n -t load_test.jmx -Jusers=100 -Jrampup=10 -Jduration=300

# Expected Results:
# - Average Response Time: < 200ms
# - 95th Percentile: < 500ms
# - Error Rate: < 1%
# - Throughput: > 100 requests/sec
```

---

## User Satisfaction Measurement

### CSAT Score Tracking
**Target**: > 4.0 / 5.0

**Survey Questions**:
1. How satisfied are you with the bot's response? (1-5)
2. Did the bot understand your intent? (Yes/No)
3. Would you recommend this to others? (Yes/No)
4. What can we improve? (Open-ended)

### Net Promoter Score (NPS)
**Formula**: % Promoters - % Detractors
**Target**: > 30

---

## Monitoring & Alerting

### Key Metrics
- Response Time (Alert if > 300ms)
- Error Rate (Alert if > 5%)
- Intent Accuracy (Alert if < 90%)
- System Uptime (Alert if < 99%)
- Active Users (Alert if spike > 200%)

### Azure Application Insights Setup
```bash
az monitor metrics alert create \
  --name response-time-alert \
  --resource-group chatbot-rg \
  --scopes /subscriptions/xxx/resourceGroups/chatbot-rg/providers/microsoft.insights/components/chatbot-insights \
  --condition "avg ResponseTime > 300" \
  --action /subscriptions/xxx/resourceGroups/chatbot-rg/providers/microsoft.insights/actionGroups/AlertsDefault
```

---

## Beta Testing Program

### Phase 1: Internal Testing (Week 1-2)
- Team tests all features
- Basic functionality validation
- Performance optimization

### Phase 2: Closed Beta (Week 3-4)
- 50 selected external users
- Real-world usage scenarios
- Collect feedback

### Phase 3: Open Beta (Week 5-6)
- Public availability
- Monitor metrics
- Gather larger user feedback

### Phase 4: Production Release (Week 7)
- Final optimization
- Go-live
- Monitor production metrics

---

## Success Criteria for Release

- ✅ Intent Accuracy > 95%
- ✅ Response Time < 200ms (avg)
- ✅ User Satisfaction > 4.0/5.0
- ✅ Zero critical bugs
- ✅ Code coverage > 80%
- ✅ All security tests pass
- ✅ Load test successful
- ✅ Documentation complete

---

**Last Updated**: April 28, 2026  
**Version**: 1.0
