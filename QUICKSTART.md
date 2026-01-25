# UpVote Quick Start Guide

## 5-Minute Setup

### Step 1: Setup Database
```bash
# From your Vercel dashboard:
# 1. Go to "Connect" → "Neon"
# 2. Create a new Neon database
# 3. Copy the connection string to your environment

# Your DATABASE_URL will look like:
# postgresql://user:password@host/database
```

### Step 2: Run Migration
```bash
npm run migrate
# or manually run /scripts/init-db.sql in your Neon console
```

### Step 3: Start Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

## Testing the Platform

### Create an Account
1. Click "Get Started" on homepage
2. Enter company name, email, password
3. Auto-redirects to dashboard

### Get Widget Code
1. Copy the code block in dashboard
2. It looks like:
   ```html
   <div data-upvote-company-id="company_abc123"></div>
   <script src="http://localhost:3000/widget.js"></script>
   ```

### Test the Widget
1. Create a test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Test Widget</title></head>
   <body>
     <h1>Feedback Section</h1>
     <div data-upvote-company-id="YOUR_COMPANY_ID"></div>
     <script src="http://localhost:3000/widget.js"></script>
   </body>
   </html>
   ```

2. Open in browser and submit feedback
3. Vote on feedback
4. Check dashboard to see updates

## Deploy to Production

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. In Vercel dashboard:
# - Connect GitHub repository
# - Add DATABASE_URL env var
# - Deploy

# Done! Your site is live
```

### Manual Deployment
```bash
npm run build
npm start

# Set DATABASE_URL environment variable
# Visit your domain
```

## Key URLs

- **Home**: `/`
- **Sign Up**: `/auth/signup`
- **Sign In**: `/auth/login`
- **Dashboard**: `/dashboard` (protected)
- **Widget Iframe**: `/widget?company_id=XXX&user_id=YYY`
- **Widget Script**: `/widget.js`

## API Endpoints

### Public (Widget)
- `GET /api/widget/feedback?company_id={id}` - Get feedback list
- `POST /api/widget/feedback?company_id={id}` - Submit feedback
- `POST /api/widget/vote` - Vote on feedback

### Protected (Dashboard)
- `GET /api/dashboard/feedback` - Get company feedback (requires auth)
- `PATCH /api/dashboard/feedback` - Update feedback status (requires auth)

### Auth
- `POST /api/auth/signup` - Register company
- `POST /api/auth/login` - Login to dashboard
- `POST /api/auth/logout` - Logout

## Common Tasks

### Change Widget Appearance
Edit `/app/widget/page.tsx` - the `<div className="min-h-screen bg-gradient...">` section

### Modify Database Schema
Edit `/scripts/init-db.sql` and re-run migration

### Add Custom Fields
1. Update SQL schema in `/scripts/init-db.sql`
2. Update API routes in `/app/api/`
3. Update React components in `/components/`

## Troubleshooting

**Database Connection Error?**
- Verify DATABASE_URL is set
- Check connection string format
- Test connection in Neon dashboard

**Widget Not Showing?**
- Check company_id is correct
- Open browser DevTools → Console for errors
- Verify widget.js path is correct

**Can't Login?**
- Clear browser cookies
- Check email/password are correct
- Verify database has users table

## Next Steps

1. ✅ Database setup
2. ✅ Run migrations
3. ✅ Create company account
4. ✅ Get widget code
5. ✅ Test widget on sample page
6. ✅ Deploy to production

See `SETUP.md` for detailed documentation.
