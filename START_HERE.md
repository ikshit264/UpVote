# START HERE - UpVote Quick Start Checklist

Welcome! You have a complete, production-ready feedback platform. Follow these steps to get started.

## ⏱️ Total Time: ~15 minutes

## Step 1: Understand What You Have (2 minutes)

Read the first 3 sections of **README.md**:
- [ ] Features
- [ ] Quick Start
- [ ] Usage (For Companies section)

**Why?** You'll understand what this platform does and what you can do with it.

## Step 2: Set Up Locally (5 minutes)

### 2a. Create Database Connection
```bash
# Go to https://neon.tech
# Create new PostgreSQL database
# Copy your connection string
```

### 2b. Add Environment Variable
Create `.env.local` file in project root:
```
DATABASE_URL=postgresql://user:password@host/database
```

### 2c. Install & Run
```bash
npm install
npm run migrate  # Run this if you see migrate script
npm run dev
```

### 2d. Verify It Works
Visit `http://localhost:3000` in browser. You should see:
- [ ] Landing page with UpVote logo
- [ ] "Get Started" button
- [ ] Feature section

## Step 3: Test Core Features (5 minutes)

### 3a. Create Company Account
```
1. Click "Get Started"
2. Fill in:
   - Company Name: "Test Company"
   - Email: "admin@test.com"
   - Password: "testpass123"
3. Click "Create account"
```

### 3b. Access Dashboard
```
- You'll be logged in automatically
- See your dashboard at /dashboard
- Copy the widget code (it will show you a code block)
```

### 3c. Test Widget
```
1. Save this as test.html:

<!DOCTYPE html>
<html>
<head><title>Widget Test</title></head>
<body>
  <h1>Test Page</h1>
  <div data-upvote-company-id="YOUR_COMPANY_ID"></div>
  <script src="http://localhost:3000/widget.js"></script>
</body>
</html>

2. Replace YOUR_COMPANY_ID with your actual ID (from dashboard)
3. Open test.html in browser
4. Submit feedback & vote
```

### 3d. Verify Dashboard Updates
```
1. Go back to /dashboard
2. You should see your feedback
3. Vote counts should appear
```

## Step 4: Next Steps (Choose One)

### 4a. Deploy Immediately ⚡ (5 minutes)
```bash
# Push to GitHub
git add .
git commit -m "Initial UpVote commit"
git push origin main

# Go to https://vercel.com/new
# Select your GitHub repo
# Add DATABASE_URL to environment
# Click Deploy
```

### 4b. Explore the Code 📚 (15 minutes)
Read these in order:
1. `/app/page.tsx` - Landing page
2. `/app/widget/page.tsx` - Widget component
3. `/app/dashboard/page.tsx` - Dashboard
4. `/app/api/widget/feedback/route.ts` - Sample API
5. `ARCHITECTURE.md` - System design

### 4c. Run Tests 🧪 (10 minutes)
Read `API_TESTING.md` and test endpoints using curl:
```bash
# Get all feedback
curl http://localhost:3000/api/widget/feedback?company_id=YOUR_ID

# See API_TESTING.md for 50+ examples
```

## Quick Reference

### Important Files
- **For Setup**: QUICKSTART.md
- **For Deployment**: DEPLOYMENT.md
- **For APIs**: API_TESTING.md
- **For Architecture**: ARCHITECTURE.md
- **For Customization**: README.md "Customization"

### Key URLs
- Home: http://localhost:3000
- Sign Up: http://localhost:3000/auth/signup
- Dashboard: http://localhost:3000/dashboard (after login)
- Widget: http://localhost:3000/widget
- Widget Script: http://localhost:3000/widget.js

### Environment Setup
```bash
# Create .env.local with:
DATABASE_URL=postgresql://...

# Then run:
npm run dev
```

## Troubleshooting

### "Database connection error"
- Check DATABASE_URL in .env.local
- Verify Neon database is running
- Test connection string in Neon dashboard

### "Can't sign up"
- Check database migrations ran
- Verify DATABASE_URL is correct
- Check npm run migrate succeeded

### "Widget not showing"
- Check company_id is correct
- Open browser DevTools → Console
- Check /widget.js is loading

### "Deployment failed"
- Verify DATABASE_URL is in Vercel env vars
- Check GitHub repo is connected
- Review build logs in Vercel

## What's Included

✅ **Complete Widget System**
- Universal embed script
- Real-time feedback collection
- Voting system
- Mobile responsive

✅ **Company Dashboard**
- Authentication
- Feedback management
- Status tracking
- One-click setup

✅ **APIs (8 endpoints)**
- Public widget APIs
- Protected dashboard APIs
- Authentication APIs

✅ **Database**
- PostgreSQL schema
- Optimization indexes
- Migration script

✅ **Documentation**
- 8 comprehensive guides
- API testing examples
- Architecture diagrams
- Deployment instructions

## Success Criteria

You'll know it's working when:
- [ ] You can sign up for company account
- [ ] Dashboard loads after login
- [ ] You can copy widget code
- [ ] Widget appears on test page
- [ ] You can submit feedback
- [ ] You can vote on feedback
- [ ] Dashboard shows feedback updates

## After Getting Started

1. **Understand the System**
   - Read ARCHITECTURE.md
   - Review /app structure
   - Check /lib utilities

2. **Customize for Your Brand**
   - Edit colors in /app/widget/page.tsx
   - Update landing page text in /app/page.tsx
   - Customize dashboard layout

3. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Add real database
   - Update domain in widget code

4. **Integrate with Your Site**
   - Get widget code from dashboard
   - Add to your website
   - Start collecting feedback

5. **Monitor & Iterate**
   - Check feedback in dashboard
   - Update status as you work
   - Share progress with customers

## Documentation Index

| Document | Topic | Time |
|----------|-------|------|
| README.md | Overview & features | 15 min |
| QUICKSTART.md | Quick setup | 5 min |
| SETUP.md | Detailed setup | 20 min |
| DEPLOYMENT.md | Production deployment | 20 min |
| API_TESTING.md | API examples & testing | 15 min |
| ARCHITECTURE.md | System design | 15 min |
| BUILD_SUMMARY.md | Code statistics | 10 min |
| DELIVERY.md | What you got | 10 min |
| INDEX.md | File navigation | 5 min |

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Database
npm run migrate      # Run migrations

# Production
npm run build        # Build for production
npm start            # Start production server
```

## Files You'll Edit Most

1. `/app/widget/page.tsx` - Widget appearance
2. `/app/page.tsx` - Landing page content
3. `/public/widget.js` - Embedding behavior
4. `/lib/auth.ts` - Authentication logic

## Getting Help

1. **Can't setup?** → Read QUICKSTART.md
2. **Want to deploy?** → Read DEPLOYMENT.md
3. **Want to test APIs?** → Read API_TESTING.md
4. **Want to understand code?** → Read ARCHITECTURE.md
5. **Want to customize?** → Read README.md

## Final Checklist

- [ ] Downloaded/cloned the project
- [ ] Created DATABASE_URL in .env.local
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Visited http://localhost:3000
- [ ] Created company account
- [ ] Accessed dashboard
- [ ] Got widget code
- [ ] Tested widget on sample page
- [ ] Ready to deploy!

---

## You're Ready! 🚀

You now have a complete, production-ready feedback platform.

**Next Action:**
1. Run `npm run dev`
2. Visit http://localhost:3000
3. Sign up for account
4. Test the widget
5. Deploy when ready

**Questions?** Check the documentation files (README.md, QUICKSTART.md, etc.)

**Happy building!**
