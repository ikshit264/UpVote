# UpVote - Customer Feedback Widget Platform

A complete, production-ready customer feedback collection platform with a universally embeddable widget. Collect feature requests, let customers vote on ideas, and prioritize development based on real feedback.

## Features

✨ **Universal Widget**
- Embed anywhere with simple HTML
- Works with any website framework
- No dependencies required
- Responsive and mobile-friendly

📊 **Dashboard**
- View all customer feedback
- Track vote counts
- Manage feedback status
- Real-time updates

🔐 **Secure**
- Company authentication
- Protected dashboard
- Session-based security
- Data isolation

⚡ **Fast**
- Optimized database queries
- Minimal widget footprint
- Iframe-based isolation
- Instant feedback submission

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd upvote

# 2. Install dependencies
npm install

# 3. Set up environment
# Create .env.local and add:
DATABASE_URL=postgresql://...

# 4. Run migrations
npm run migrate

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Usage

### For Companies

1. **Sign Up**
   - Visit `/auth/signup`
   - Create account with email and password

2. **Get Widget Code**
   - Access your dashboard at `/dashboard`
   - Copy the widget embedding code
   - Code includes your unique company ID

3. **Embed on Your Site**
   ```html
   <div data-upvote-company-id="your_company_id"></div>
   <script src="https://your-domain.com/widget.js"></script>
   ```

4. **Manage Feedback**
   - View all submissions in dashboard
   - Track vote counts
   - Update status (new, planned, in_progress, completed)

### For End Users

1. **Submit Feedback**
   - Type title and description
   - Submit with one click
   - Appears instantly in list

2. **Vote on Ideas**
   - Click upvote button
   - See vote counts
   - Create community around ideas

## Architecture

### Frontend
- **Home Page** (`/page.tsx`) - Marketing & CTAs
- **Auth Pages** (`/auth/signup`, `/auth/login`) - Company authentication
- **Dashboard** (`/dashboard/page.tsx`) - Company feedback management
- **Widget Page** (`/widget/page.tsx`) - User-facing feedback interface

### Backend
- **Auth APIs** - Company registration, login, logout
- **Widget APIs** - Public feedback submission and voting
- **Dashboard APIs** - Protected feedback management
- **Database** - PostgreSQL with optimized schema

### Widget Script
- **widget.js** - Universal embedding script
- Zero-dependency
- Class-name based detection
- Iframe isolation

## File Structure

```
upvote/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── widget/        # Public widget APIs
│   │   └── dashboard/     # Protected dashboard APIs
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard page
│   ├── widget/            # Widget iframe page
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── dashboard-content.tsx
│   ├── feedback-list.tsx
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── db.ts              # Database client
│   ├── auth.ts            # Authentication utilities
│   └── utils.ts
├── public/
│   ├── widget.js          # Widget script
│   └── example-integration.html
├── scripts/
│   └── init-db.sql        # Database schema
├── SETUP.md               # Detailed setup guide
├── QUICKSTART.md          # Quick start guide
└── README.md              # This file
```

## Database Schema

### Companies
```sql
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Feedback
```sql
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Votes
```sql
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  feedback_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP,
  UNIQUE(feedback_id, user_id),
  FOREIGN KEY (feedback_id) REFERENCES feedback(id)
);
```

### Sessions
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

## API Reference

### Public Widget APIs

#### Get Feedback
```
GET /api/widget/feedback?company_id={id}
```

#### Submit Feedback
```
POST /api/widget/feedback?company_id={id}
Content-Type: application/json

{
  "title": "Feature request",
  "description": "Optional description"
}
```

#### Vote on Feedback
```
POST /api/widget/vote
Content-Type: application/json

{
  "feedback_id": "feedback_123",
  "user_id": "user_identifier"
}
```

### Company APIs

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Company Name",
  "email": "company@example.com",
  "password": "secure_password"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "company@example.com",
  "password": "password"
}
```

#### Logout
```
POST /api/auth/logout
```

### Protected Dashboard APIs

#### Get Company Feedback
```
GET /api/dashboard/feedback
(Requires valid session)
```

#### Update Feedback Status
```
PATCH /api/dashboard/feedback
Content-Type: application/json

{
  "id": "feedback_123",
  "status": "planned"
}
```

Valid statuses: `new`, `planned`, `in_progress`, `completed`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

### Manual Deployment

```bash
npm run build
DATABASE_URL=... npm start
```

## Security

- ✅ HTTP-only session cookies
- ✅ Password hashing (SHA-256)
- ✅ Company data isolation
- ✅ Protected dashboard routes
- ✅ CORS-aware widget script
- ✅ Input validation and sanitization

## Performance

- ✅ Optimized database indexes
- ✅ Minimal widget script (~600 bytes)
- ✅ Iframe isolation
- ✅ Efficient polling for updates
- ✅ Server-side session validation

## Development

### Run Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Database Migrations
```bash
npm run migrate
```

### Build for Production
```bash
npm run build
npm start
```

## Customization

### Change Widget Appearance
Edit `/app/widget/page.tsx` for colors, layout, and styling.

### Modify Database
Edit `/scripts/init-db.sql` to add fields or change schema.

### Custom Authentication
Modify `/lib/auth.ts` for different password hashing or session management.

## Troubleshooting

**Widget not appearing?**
- Check `data-upvote-company-id` is correct
- Verify script path in `data-upvote-widget-url`
- Check browser console for errors

**Database connection error?**
- Verify `DATABASE_URL` is set correctly
- Test connection in database dashboard
- Check credentials and permissions

**Login issues?**
- Clear browser cookies
- Verify database initialization
- Check email and password are correct

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this in your projects!

## Support

- 📖 See `SETUP.md` for detailed setup guide
- ⚡ See `QUICKSTART.md` for quick start
- 🔗 Visit `/public/example-integration.html` for integration examples
- 💬 Open an issue for bugs or feature requests

## Roadmap

- [ ] Email notifications
- [ ] Custom widget branding
- [ ] Analytics dashboard
- [ ] Webhook integrations
- [ ] Mobile app
- [ ] Advanced search and filtering
- [ ] Attachment support
- [ ] Team collaboration features

---

Built with ❤️ using Next.js, React, and PostgreSQL
