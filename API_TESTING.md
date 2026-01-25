# UpVote API Testing Guide

Complete guide to test all UpVote APIs using curl, Postman, or browser.

## Setup

### Local Testing
```bash
npm run dev
# API base: http://localhost:3000
```

### Production Testing
```bash
# API base: https://your-domain.com
```

## Authentication APIs

### 1. Sign Up (Create Company Account)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "email": "admin@mycompany.com",
    "password": "securepassword123"
  }'
```

**Success Response (201):**
```json
{
  "company": {
    "id": "company_1234567890abc",
    "name": "My Company",
    "email": "admin@mycompany.com"
  },
  "message": "Company registered successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Email already registered"
}
```

### 2. Login (Get Session)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@mycompany.com",
    "password": "securepassword123"
  }'
```

**Success Response (200):**
```json
{
  "company": {
    "id": "company_1234567890abc",
    "name": "My Company",
    "email": "admin@mycompany.com"
  },
  "message": "Logged in successfully"
}
```

**Note:** Session cookie is automatically set. Save with `-c cookies.txt`

### 3. Logout

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## Widget APIs (Public)

### Get All Feedback

**Request:**
```bash
curl http://localhost:3000/api/widget/feedback?company_id=company_1234567890abc
```

**Response (200):**
```json
{
  "feedback": [
    {
      "id": "feedback_111",
      "title": "Dark mode support",
      "description": "Add dark mode to the app",
      "status": "new",
      "created_at": "2024-01-21T10:00:00Z",
      "vote_count": 5
    },
    {
      "id": "feedback_222",
      "title": "Export to CSV",
      "description": "Allow exporting data",
      "status": "planned",
      "created_at": "2024-01-21T09:00:00Z",
      "vote_count": 3
    }
  ]
}
```

### Submit Feedback

**Request:**
```bash
curl -X POST http://localhost:3000/api/widget/feedback?company_id=company_1234567890abc \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dark mode support",
    "description": "Add dark mode to the app"
  }'
```

**Success Response (201):**
```json
{
  "feedback": {
    "id": "feedback_333",
    "title": "Dark mode support",
    "description": "Add dark mode to the app",
    "status": "new",
    "created_at": "2024-01-21T12:00:00Z",
    "vote_count": 0
  }
}
```

**Error Response (400):**
```json
{
  "error": "title is required"
}
```

### Vote on Feedback

**Request:**
```bash
curl -X POST http://localhost:3000/api/widget/vote \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_id": "feedback_111",
    "user_id": "user_or_anon_id"
  }'
```

**Success Response (200) - First Vote:**
```json
{
  "voted": true,
  "vote_count": 6
}
```

**Success Response (200) - Removing Vote:**
```json
{
  "voted": false,
  "vote_count": 5
}
```

**Testing Tip:** Use same `user_id` to toggle vote

## Dashboard APIs (Protected)

All dashboard APIs require valid session. Include cookies from login:

```bash
curl ... -b cookies.txt
```

### Get Dashboard Feedback

**Request:**
```bash
curl http://localhost:3000/api/dashboard/feedback \
  -b cookies.txt
```

**Response (200):**
```json
{
  "feedback": [
    {
      "id": "feedback_111",
      "title": "Dark mode support",
      "description": "Add dark mode to the app",
      "status": "new",
      "created_at": "2024-01-21T10:00:00Z",
      "vote_count": 5
    }
  ]
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

### Update Feedback Status

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/dashboard/feedback \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "id": "feedback_111",
    "status": "planned"
  }'
```

**Success Response (200):**
```json
{
  "feedback": {
    "id": "feedback_111",
    "title": "Dark mode support",
    "status": "planned",
    "created_at": "2024-01-21T10:00:00Z"
  }
}
```

**Valid Statuses:**
- `new` - New feedback
- `planned` - Planned for future
- `in_progress` - Currently being worked on
- `completed` - Already implemented

## Complete Testing Workflow

### Step 1: Create Account
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "Test Company",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Save the company ID from response.

### Step 2: Get Feedback (Should be empty)
```bash
curl http://localhost:3000/api/widget/feedback?company_id=COMPANY_ID
```

### Step 3: Submit Sample Feedback
```bash
curl -X POST http://localhost:3000/api/widget/feedback?company_id=COMPANY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feedback",
    "description": "This is a test"
  }'
```

Save the feedback ID from response.

### Step 4: Vote on Feedback
```bash
curl -X POST http://localhost:3000/api/widget/vote \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_id": "FEEDBACK_ID",
    "user_id": "test_user_1"
  }'
```

### Step 5: Get Updated Feedback
```bash
curl http://localhost:3000/api/widget/feedback?company_id=COMPANY_ID
```

Note increased vote_count.

### Step 6: Login to Dashboard
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Step 7: Get Dashboard Feedback
```bash
curl http://localhost:3000/api/dashboard/feedback \
  -b cookies.txt
```

### Step 8: Update Feedback Status
```bash
curl -X PATCH http://localhost:3000/api/dashboard/feedback \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "id": "FEEDBACK_ID",
    "status": "in_progress"
  }'
```

### Step 9: Verify Status Changed
```bash
curl http://localhost:3000/api/dashboard/feedback \
  -b cookies.txt
```

### Step 10: Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Postman Collection

### Import
1. Open Postman
2. Create new collection "UpVote"
3. Add requests below

### Request Templates

**Auth - Sign Up**
- Method: POST
- URL: {{baseUrl}}/api/auth/signup
- Body (JSON):
```json
{
  "name": "My Company",
  "email": "{{email}}",
  "password": "{{password}}"
}
```

**Auth - Login**
- Method: POST
- URL: {{baseUrl}}/api/auth/login
- Body (JSON):
```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

**Widget - Get Feedback**
- Method: GET
- URL: {{baseUrl}}/api/widget/feedback?company_id={{companyId}}

**Widget - Submit Feedback**
- Method: POST
- URL: {{baseUrl}}/api/widget/feedback?company_id={{companyId}}
- Body (JSON):
```json
{
  "title": "New Feature",
  "description": "Description here"
}
```

**Widget - Vote**
- Method: POST
- URL: {{baseUrl}}/api/widget/vote
- Body (JSON):
```json
{
  "feedback_id": "{{feedbackId}}",
  "user_id": "{{userId}}"
}
```

**Dashboard - Get Feedback**
- Method: GET
- URL: {{baseUrl}}/api/dashboard/feedback

**Dashboard - Update Status**
- Method: PATCH
- URL: {{baseUrl}}/api/dashboard/feedback
- Body (JSON):
```json
{
  "id": "{{feedbackId}}",
  "status": "planned"
}
```

### Environment Variables
Create environment with:
- `baseUrl`: http://localhost:3000
- `email`: test@example.com
- `password`: testpass123
- `companyId`: (fill after signup)
- `feedbackId`: (fill after submitting feedback)
- `userId`: anon_user_1

## Error Testing

### Missing Parameters
```bash
# Missing company_id
curl http://localhost:3000/api/widget/feedback

# Response: 400 Bad Request
# { "error": "company_id is required" }
```

### Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpass"
  }'

# Response: 401 Unauthorized
# { "error": "Invalid credentials" }
```

### Unauthorized Access
```bash
# Without session cookie
curl http://localhost:3000/api/dashboard/feedback

# Response: 401 Unauthorized
# { "error": "Unauthorized" }
```

### Password Too Short
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company",
    "email": "test@example.com",
    "password": "short"
  }'

# Response: 400 Bad Request
# { "error": "Password must be at least 8 characters" }
```

## Performance Testing

### Load Test Widget API
```bash
# Using Apache Bench
ab -n 1000 -c 10 \
  "http://localhost:3000/api/widget/feedback?company_id=COMPANY_ID"
```

### Response Time Check
```bash
# Check response time
time curl http://localhost:3000/api/widget/feedback?company_id=COMPANY_ID
```

## Browser Testing

### Test Widget Widget
1. Go to http://localhost:3000/public/example-integration.html
2. Update company_id in HTML
3. Open DevTools → Network tab
4. Verify requests to API endpoints

### Test Dashboard
1. Sign up: http://localhost:3000/auth/signup
2. Login: http://localhost:3000/auth/login
3. View dashboard: http://localhost:3000/dashboard
4. Check Network tab for API calls

## Debugging

### Enable SQL Logging
Check your database logs for query performance.

### Monitor Network Requests
1. Open browser DevTools
2. Go to Network tab
3. Filter by Fetch/XHR
4. Submit feedback and vote
5. Review request/response

### Check Cookies
```bash
# View session cookie
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -v \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Look for: Set-Cookie: session_id=...
```

## Common Issues

**404 Not Found**
- Check API path is correct
- Verify company_id/feedback_id are valid

**500 Internal Server Error**
- Check database is running
- Review server logs
- Verify DATABASE_URL is correct

**Request Timeout**
- Check database performance
- Review slow queries
- Check network latency

---

Ready to test? Start with the "Complete Testing Workflow" above!
