# UpVote - Customer Feedback Widget

A complete feedback collection platform with a universally embeddable widget. Companies can collect, vote on, and manage customer feedback.

## Architecture

### Key Components

1. **Widget Script** (`/public/widget.js`)
   - Universal, class-name based embedding
   - No framework dependencies
   - Automatic iframe initialization
   - Works via `data-upvote-company-id` attribute

2. **Widget Page** (`/app/widget/page.tsx`)
   - Isolated iframe experience
   - Feedback submission and voting
   - Real-time updates

3. **APIs**
   - `/api/widget/feedback` - Widget feedback operations (public)
   - `/api/widget/vote` - Widget voting (public)
   - `/api/auth/signup` - Company registration
   - `/api/auth/login` - Company authentication
   - `/api/auth/logout` - Company logout
   - `/api/dashboard/feedback` - Dashboard feedback management (protected)

4. **Dashboard** (`/app/dashboard/page.tsx`)
   - Protected company interface
   - Widget installation code
   - Feedback management and status tracking
   - Real-time statistics

## Database Setup

### Prerequisites

1. Create a Neon PostgreSQL database
2. Set the `DATABASE_URL` environment variable

### Initialize Database

Run the migration script:

```bash
npm run migrate
```

Or manually execute `/scripts/init-db.sql` in your database:

```sql
-- Tables created:
-- companies
-- feedback
-- votes
-- sessions
```

## Installation & Setup

### 1. Environment Variables

Add to your `.env.local`:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
npm run migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage

### For Companies

1. **Sign Up**
   - Go to `/auth/signup`
   - Create account with email and password
   - Redirects to dashboard

2. **Get Widget Code**
   - Copy the embedding code from dashboard
   - The code includes your unique `company_id`

3. **Embed Widget**
   ```html
   <div data-upvote-company-id="your_company_id"></div>
   <script src="https://your-domain.com/widget.js"></script>
   ```

4. **Manage Feedback**
   - View all feedback in dashboard
   - Change status (new, planned, in_progress, completed)
   - See vote counts

### For End Users

1. **Access Widget**
   - Widget appears where embedded
   - No login required for feedback submission

2. **Submit Feedback**
   - Enter title and optional description
   - Click "Submit Feedback"
   - Feedback appears in list

3. **Vote**
   - Click upvote button on feedback
   - Uses anonymous user ID (stored in iframe)
   - One vote per user per feedback item

## API Documentation

### Widget APIs (Public)

#### GET `/api/widget/feedback?company_id={id}`
Get all feedback for a company.

```json
{
  "feedback": [
    {
      "id": "feedback_123",
      "title": "Dark mode",
      "description": "Add dark mode support",
      "status": "new",
      "created_at": "2024-01-21T10:00:00Z",
      "vote_count": 5
    }
  ]
}
```

#### POST `/api/widget/feedback?company_id={id}`
Submit new feedback.

Request:
```json
{
  "title": "Dark mode",
  "description": "Add dark mode support"
}
```

Response (201):
```json
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

#### POST `/api/widget/vote`
Vote or unvote on feedback (toggle).

Request:
```json
{
  "feedback_id": "feedback_123",
  "user_id": "user_or_anon_id"
}
```

Response:
```json
{
  "voted": true,
  "vote_count": 5
}
```

### Auth APIs (Company)

#### POST `/api/auth/signup`
Register a company.

Request:
```json
{
  "name": "My Company",
  "email": "admin@company.com",
  "password": "secure_password"
}
```

#### POST `/api/auth/login`
Login to dashboard.

Request:
```json
{
  "email": "admin@company.com",
  "password": "secure_password"
}
```

#### POST `/api/auth/logout`
Logout from dashboard.

### Dashboard APIs (Protected)

All require valid session cookie.

#### GET `/api/dashboard/feedback`
Get all feedback for logged-in company.

#### PATCH `/api/dashboard/feedback`
Update feedback status.

Request:
```json
{
  "id": "feedback_123",
  "status": "planned"
}
```

Valid statuses: `new`, `planned`, `in_progress`, `completed`

## Security Features

1. **Session Management**
   - HTTP-only cookies
   - 30-day expiration
   - Server-side validation

2. **Password Security**
   - SHA-256 hashing
   - Minimum 8 characters

3. **Authorization**
   - Company isolation (can only see own feedback)
   - Protected dashboard routes
   - CORS considerations for widget

4. **Data Validation**
   - Input validation on all endpoints
   - Type checking for status updates

## Performance Optimizations

1. **Database Indexes**
   - Company ID on feedback
   - Feedback ID on votes
   - User ID on votes
   - Company ID on sessions

2. **Widget Script**
   - Minimal footprint (~600 bytes)
   - No external dependencies in widget.js
   - Iframe isolation

3. **API Response Caching**
   - Widget feedback list can be cached client-side
   - Dashboard uses server-side session validation

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add `DATABASE_URL` to environment variables
3. Deploy

### Custom Deployment

1. Build: `npm run build`
2. Set environment variables
3. Run: `npm run start`

## File Structure

```
/app
  /api
    /auth
      /signup/route.ts
      /login/route.ts
      /logout/route.ts
    /widget
      /feedback/route.ts
      /vote/route.ts
    /dashboard
      /feedback/route.ts
  /auth
    /login/page.tsx
    /signup/page.tsx
  /dashboard
    /page.tsx
  /widget
    /page.tsx
    /loading.tsx
  /page.tsx

/components
  /dashboard-content.tsx
  /feedback-list.tsx
  /ui
    /* shadcn/ui components */

/lib
  /db.ts
  /auth.ts

/public
  /widget.js

/scripts
  /init-db.sql
```

## Customization

### Widget Styling
Edit `/app/widget/page.tsx` to customize colors and layout.

### Database Schema
See `/scripts/init-db.sql` for table definitions.

### Authentication
Modify `/lib/auth.ts` for different password hashing or session management.

## Troubleshooting

### Widget Not Showing
1. Check `data-upvote-company-id` attribute is correct
2. Verify `data-upvote-widget-url` points to correct domain
3. Check browser console for errors

### Login Issues
1. Verify database is initialized
2. Check DATABASE_URL is correct
3. Clear browser cookies

### Feedback Not Saving
1. Check network requests in browser DevTools
2. Verify company_id in requests
3. Check database permissions

## Future Enhancements

- [ ] Email notifications for feedback updates
- [ ] Custom branding for widgets
- [ ] Analytics dashboard
- [ ] Webhook integrations
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Attachment support
- [ ] Advanced filtering and search

## Support

For issues or questions, check the troubleshooting section or review the API documentation above.
