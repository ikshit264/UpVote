# UpVote Architecture

Complete system design and architecture documentation.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Customer's Website                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  <div data-upvote-company-id="..."></div>          │  │ │
│  │  │  <script src="/.../widget.js"></script>            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ↓                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │         widget.js (Universal Script)               │  │ │
│  │  │  - Detects data- attributes                        │  │ │
│  │  │  - Creates iframes                                 │  │ │
│  │  │  - Loads widget page                               │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Company Dashboard                              │ │
│  │  - /auth/signup                                            │ │
│  │  - /auth/login                                             │ │
│  │  - /dashboard                                              │ │
│  │  - View/manage feedback                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Widget Page (in iframe)                        │ │
│  │  - /widget?company_id=...&user_id=...                       │ │
│  │  - Submit feedback                                         │ │
│  │  - Vote on ideas                                           │ │
│  │  - View feedback list                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                   (Next.js API Routes)                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Authentication APIs                                     │   │
│  │ - POST /api/auth/signup (register)                      │   │
│  │ - POST /api/auth/login (authenticate)                   │   │
│  │ - POST /api/auth/logout (session clear)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Widget APIs (Public)                                    │   │
│  │ - GET /api/widget/feedback?company_id=                  │   │
│  │ - POST /api/widget/feedback?company_id=                 │   │
│  │ - POST /api/widget/vote                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Dashboard APIs (Protected)                              │   │
│  │ - GET /api/dashboard/feedback (requires session)        │   │
│  │ - PATCH /api/dashboard/feedback (update status)         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│                   PostgreSQL Database                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  companies   │  │  feedback    │  │   votes      │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ id (PK)      │  │ id (PK)      │  │ id (PK)      │          │
│  │ name         │  │ company_id   │  │ feedback_id  │          │
│  │ email        │  │ (FK)         │  │ (FK)         │          │
│  │ password_hash│  │ title        │  │ user_id      │          │
│  │ timestamps   │  │ description  │  │ created_at   │          │
│  │              │  │ status       │  │              │          │
│  │ sessions     │  │ timestamps   │  │ UNIQUE(f,u)  │          │
│  │ (related)    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Indexes                                  │  │
│  │ - idx_feedback_company_id                                │  │
│  │ - idx_votes_feedback_id                                  │  │
│  │ - idx_votes_user_id                                      │  │
│  │ - idx_sessions_company_id                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
Next.js App
│
├── /page.tsx (Landing Page)
│   └── Features overview
│
├── /auth/signup/page.tsx (Signup)
│   ├── Sign up form
│   └── Validation
│
├── /auth/login/page.tsx (Login)
│   ├── Login form
│   └── Session creation
│
├── /dashboard/page.tsx (Dashboard)
│   └── DashboardContent
│       ├── Header (company info)
│       ├── Widget setup section
│       └── FeedbackList
│           ├── Feedback items
│           └── Status selector
│
└── /widget/page.tsx (Widget Page)
    ├── Submit form
    └── Feedback list
        ├── Feedback items
        └── Vote buttons
```

## Data Flow Diagram

### Feedback Submission Flow
```
User writes feedback in widget
         ↓
Form validation (client)
         ↓
POST /api/widget/feedback
         ↓
Server validation
         ↓
Generate feedback ID
         ↓
Insert into database
         ↓
Return feedback + ID
         ↓
Update UI with new feedback
```

### Voting Flow
```
User clicks upvote in widget
         ↓
POST /api/widget/vote
  {feedback_id, user_id}
         ↓
Check if vote exists
         ↓
If exists: DELETE vote
If not: INSERT vote
         ↓
Count votes for feedback
         ↓
Return {voted: bool, count}
         ↓
Update vote count in UI
```

### Dashboard Status Update Flow
```
Company clicks status dropdown
         ↓
PATCH /api/dashboard/feedback
  {id, status}
         ↓
Verify session (auth check)
         ↓
Verify feedback belongs to company
         ↓
Update status in database
         ↓
Return updated feedback
         ↓
Update UI
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│        Authentication Layer                  │
├─────────────────────────────────────────────┤
│                                              │
│  User Input → Validation → Password Hash    │
│       ↓                                      │
│  SHA-256(password) → Store in DB            │
│       ↓                                      │
│  Create Session → HTTP-only Cookie          │
│       ↓                                      │
│  30-day expiration                          │
│                                              │
└─────────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────┐
│      Authorization Layer                     │
├─────────────────────────────────────────────┤
│                                              │
│  Dashboard Routes:                           │
│  Check session cookie → Verify company      │
│       ↓                                      │
│  Widget APIs:                                │
│  No auth required (public)                  │
│       ↓                                      │
│  Data Isolation:                             │
│  Company only sees own feedback             │
│                                              │
└─────────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────┐
│        Data Layer Security                   │
├─────────────────────────────────────────────┤
│                                              │
│  Input Validation:                           │
│  - Type checking                            │
│  - Length validation                        │
│  - Sanitization                             │
│       ↓                                      │
│  Database Security:                          │
│  - Parameterized queries                    │
│  - No SQL injection risk                    │
│  - Foreign key constraints                  │
│                                              │
└─────────────────────────────────────────────┘
```

## Request/Response Flow

### Widget Feedback Submission
```
Client Request:
  POST /api/widget/feedback?company_id=abc123
  {
    "title": "Dark mode",
    "description": "Add dark mode support"
  }

Server Processing:
  1. Validate company_id exists
  2. Validate title not empty
  3. Generate unique feedback ID
  4. Insert into feedback table
  5. Return new feedback item

Server Response:
  201 Created
  {
    "feedback": {
      "id": "feedback_123",
      "title": "Dark mode",
      "description": "Add dark mode support",
      "status": "new",
      "created_at": "2024-01-21T10:00:00Z",
      "vote_count": 0
    }
  }
```

### Dashboard Protected Request
```
Client Request:
  GET /api/dashboard/feedback
  (with session_id cookie)

Server Processing:
  1. Extract session cookie
  2. Look up session in database
  3. Check if expired (< NOW())
  4. Get company_id from session
  5. Query feedback WHERE company_id = ...
  6. COUNT votes per feedback
  7. Sort by vote count

Server Response:
  200 OK
  {
    "feedback": [
      {
        "id": "feedback_1",
        "title": "Feature A",
        "status": "planned",
        "vote_count": 15
      },
      ...
    ]
  }
```

## Session Management

```
Login Process:
  1. POST /api/auth/login {email, password}
  2. Query database for company with email
  3. SHA-256(password) == stored_hash? → Verify
  4. If valid:
     - Generate session ID
     - Set expires_at = NOW() + 30 days
     - Insert into sessions table
     - Set HTTP-only cookie
     - Redirect to /dashboard

Cookie Details:
  - Name: session_id
  - Value: session_12345...
  - HttpOnly: true (JS can't access)
  - Secure: true (HTTPS only in production)
  - SameSite: lax
  - Max-Age: 2592000 (30 days)

Session Validation:
  - Check cookie exists
  - Query sessions table
  - Verify not expired
  - Get company info
  - Allow request or 401
```

## Database Query Patterns

### Get Company's Feedback with Vote Counts
```sql
SELECT 
  f.id,
  f.title,
  f.description,
  f.status,
  f.created_at,
  COUNT(v.id) as vote_count
FROM feedback f
LEFT JOIN votes v ON f.id = v.feedback_id
WHERE f.company_id = $1
GROUP BY f.id
ORDER BY vote_count DESC, f.created_at DESC
```

### Check if User Already Voted
```sql
SELECT id FROM votes 
WHERE feedback_id = $1 AND user_id = $2
```

### Get Active Session
```sql
SELECT c.id, c.name, c.email 
FROM companies c
JOIN sessions s ON c.id = s.company_id
WHERE s.id = $1 AND s.expires_at > NOW()
```

## Performance Considerations

### Database Indexes
- `feedback.company_id` → Fast company lookups
- `votes.feedback_id` → Fast vote counts
- `votes.user_id` → Fast user vote history
- `sessions.company_id` → Fast session lookups

### Query Optimization
- Use `COUNT(*) with GROUP BY` for aggregation
- LEFT JOIN for optional related data
- Indexes on foreign keys
- Parameterized queries (prevent full scans)

### Widget Script Optimization
- 33 lines of code
- No external dependencies
- Minimal HTTP requests
- Lazy iframe creation
- Event delegation

## Scalability Architecture

```
Current (Single Server):
  Client → Next.js App → PostgreSQL DB

Scaling Opportunity 1 (Connection Pooling):
  Client → Next.js App → PgBouncer → PostgreSQL DB

Scaling Opportunity 2 (Read Replicas):
  Client → Next.js App → PostgreSQL Primary
                      ↳ Read Replica (for GET requests)

Scaling Opportunity 3 (Load Balancing):
  Client ↱ Load Balancer ↲ Next.js App 1
                         ↳ Next.js App 2
                         ↳ Next.js App 3
                         ↓
                    PostgreSQL DB

Scaling Opportunity 4 (Caching):
  Client → Next.js App → Redis (cache) → PostgreSQL DB
```

## Error Handling Architecture

```
┌─────────────────────────────────────────┐
│         Request Validation               │
├─────────────────────────────────────────┤
│                                          │
│  Missing params?     → 400 Bad Request  │
│  Invalid types?      → 400 Bad Request  │
│  Unauthorized?       → 401 Unauthorized │
│  Not found?          → 404 Not Found    │
│  Server error?       → 500 Internal     │
│                                          │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│       Error Response Format              │
├─────────────────────────────────────────┤
│                                          │
│  {                                       │
│    "error": "Human-readable message"     │
│  }                                       │
│                                          │
│  With appropriate HTTP status code       │
│                                          │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
Development:
  Local machine
  → localhost:3000
  → DATABASE_URL (local or remote)

Staging:
  Vercel Preview
  → pr-123.vercel.app
  → DATABASE_URL (staging DB)

Production:
  Vercel Production
  → yourdomain.com
  → DATABASE_URL (production DB)

Alternative (Docker):
  Docker Container
  → Port 3000
  → DATABASE_URL (external DB)
  → Nginx reverse proxy
  → SSL/TLS termination
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State**: React hooks + SWR for data

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js 16 API Routes
- **Database**: PostgreSQL
- **Client**: @neondatabase/serverless (Neon) or pg (standard)

### Widget
- **Type**: Vanilla JavaScript
- **Dependencies**: None
- **Size**: ~600 bytes (gzipped)
- **Approach**: Iframe-based isolation

### Deployment
- **Hosting**: Vercel (recommended)
- **Alternative**: Docker, Node.js servers, serverless
- **Database**: Neon PostgreSQL (recommended)

## Code Organization Principles

1. **Separation of Concerns**
   - API routes handle business logic
   - Components handle UI
   - Library functions handle utilities

2. **Modularity**
   - Each API route is independent
   - Each component is reusable
   - Database utilities are centralized

3. **Type Safety**
   - TypeScript throughout
   - Type checking on all inputs
   - No `any` types

4. **Security First**
   - Input validation on all endpoints
   - Authentication checks on protected routes
   - Parameterized database queries

---

This architecture ensures the application is scalable, secure, and maintainable while keeping the code clean and organized.
