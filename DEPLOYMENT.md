# UpVote Deployment Checklist

Complete guide to ship UpVote to production.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] All dependencies are in package.json
- [ ] DATABASE_URL environment variable is set
- [ ] Database migrations are run
- [ ] Tests pass (if applicable)
- [ ] No console errors in development

## Database Setup

### Option 1: Neon (Recommended)
```bash
# 1. Visit https://neon.tech
# 2. Create new project
# 3. Copy connection string
# 4. Add to environment: DATABASE_URL=...
# 5. Run migrations:
npm run migrate
```

### Option 2: Self-Hosted PostgreSQL
```bash
# 1. Create PostgreSQL database
# 2. Get connection string
# 3. Add to environment: DATABASE_URL=...
# 4. Run migrations:
npm run migrate
```

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial UpVote commit"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### Step 3: Environment Variables
In Vercel project settings:
- Add `DATABASE_URL` with your database connection string
- Add any other required env vars

### Step 4: Deploy
```bash
# Vercel auto-deploys on push, or manually:
vercel deploy --prod
```

Your site is now live! 🎉

## Custom Server Deployment

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Server with public IP/domain

### Step 1: Build Application
```bash
npm install
npm run build
```

### Step 2: Set Environment Variables
```bash
export DATABASE_URL="postgresql://user:pass@host/db"
export NODE_ENV="production"
```

### Step 3: Start Server
```bash
npm start
# Server runs on port 3000
```

### Step 4: Configure Reverse Proxy

#### Nginx Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache Example
```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

### Step 5: Enable HTTPS
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d yourdomain.com
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t upvote:latest .
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV="production" \
  --name upvote \
  upvote:latest
```

### Docker Compose Example
```yaml
version: '3.8'

services:
  upvote:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/upvote
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=upvote
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Post-Deployment

### Verification
- [ ] Home page loads: https://yourdomain.com
- [ ] Sign up works: https://yourdomain.com/auth/signup
- [ ] Login works: https://yourdomain.com/auth/login
- [ ] Dashboard accessible after login
- [ ] Widget script loads: https://yourdomain.com/widget.js
- [ ] Example integration loads: https://yourdomain.com/example-integration.html

### Configuration
1. Update widget URLs in marketing materials
2. Test widget embedding on your actual domain
3. Update security headers if needed
4. Enable CORS if widget used on other domains

### Monitoring
- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Enable application logs
- [ ] Monitor database performance
- [ ] Set up uptime monitoring
- [ ] Configure backup schedule for database

## Domain Configuration

### DNS Records Needed
If using a subdomain (e.g., feedback.yourdomain.com):

```
CNAME record pointing to your deployment:
Name: feedback
Type: CNAME
Value: your-app.vercel.app (or your custom domain)
```

### SSL/HTTPS
- Vercel: Automatic ✅
- Self-hosted: Use Let's Encrypt with Certbot
- Never use HTTP in production

## Security Checklist

- [ ] HTTPS enabled
- [ ] DATABASE_URL is secret (not in repo)
- [ ] Session cookies are HTTP-only
- [ ] Password hashing is enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting considered
- [ ] Database has proper backups
- [ ] Error messages don't leak sensitive info

## Performance Optimization

- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Widget script minified
- [ ] CDN enabled (if available)
- [ ] Caching headers configured
- [ ] Compression enabled (gzip)

## Database Backup

### For Neon
```bash
# Automatic daily backups included
# Manual backup in Neon dashboard
```

### For PostgreSQL
```bash
# Daily backup script
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/upvote-$(date +\%Y\%m\%d).sql.gz
```

## Scaling Considerations

As user base grows:
- [ ] Database connection pooling (PgBouncer)
- [ ] Read replicas for queries
- [ ] Caching layer (Redis)
- [ ] CDN for static assets
- [ ] Load balancing (multiple servers)
- [ ] Database partitioning

## Troubleshooting Deployment

**Site shows 500 error**
- Check server logs: `npm logs`
- Verify DATABASE_URL is correct
- Check database is accessible
- Review application errors

**Widget not working**
- Verify widget.js path is correct
- Check CORS headers
- Test from different domain
- Review browser console

**Performance is slow**
- Check database query times
- Analyze slow queries
- Consider adding indexes
- Review application metrics

**Database connection fails**
- Verify DATABASE_URL connection string
- Check database is running
- Verify firewall rules
- Test connection manually

## Rollback Procedure

If something goes wrong:

### Vercel
```bash
# Revert to previous deployment
vercel rollback
```

### Manual Server
```bash
git revert HEAD
npm run build
npm start
```

## Maintenance

### Regular Tasks
- Monitor error logs
- Review performance metrics
- Update dependencies: `npm update`
- Test backup restoration
- Review security logs

### Monthly
- Check database health
- Review slow queries
- Test disaster recovery
- Update security patches

### Quarterly
- Performance audit
- Security audit
- Capacity planning
- User feedback review

## Support & Help

- 📖 See README.md for overview
- ⚡ See QUICKSTART.md for setup
- 🔧 See SETUP.md for detailed guide
- 🐛 Check logs for errors
- 💬 Review API documentation

## Success! 🎉

Your UpVote feedback platform is now live in production!

### Next Steps
1. Announce to users
2. Update your website with widget code
3. Share dashboard with team
4. Start collecting feedback
5. Monitor for issues

### Marketing
- Add widget to your website
- Share integration guide with customers
- Highlight customer feedback process
- Use feedback to improve product

---

Questions? Check the documentation or review logs for more details.
