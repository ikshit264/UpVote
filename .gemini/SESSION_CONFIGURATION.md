# User Session Configuration

## Overview
User sessions are configured to persist for **7 days** with automatic session extension for active users.

## Current Configuration

### Session Settings (`lib/auth.ts`)

```typescript
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // 7 days (604,800 seconds)
  updateAge: 24 * 60 * 60,  // Extend session if user is active (check every 24 hours)
}
```

### How It Works

1. **7-Day Session Duration**: 
   - Users stay logged in for 7 days from their last login
   - After 7 days of inactivity, they'll need to log in again

2. **Automatic Extension**:
   - If a user visits the site within 24 hours before their session expires, the session automatically extends for another 7 days
   - This means active users won't need to log in repeatedly

3. **JWT Token**:
   - Uses JSON Web Tokens (JWT) for stateless authentication
   - Tokens are stored securely in HTTP-only cookies
   - No server-side session storage needed

## Session Lifecycle Example

| Day | Action | Session Status |
|-----|--------|---------------|
| **Day 0** | User logs in | ✅ Session created (7 days) |
| **Day 3** | User visits site | ✅ Session active (4 days left) |
| **Day 6** | User visits site | ✅ Session extended (7 more days) |
| **Day 7** | No activity | ⏰ Session expires if no visit |

## Security Features

### Current Security Measures:
- ✅ **HTTP-only cookies** - Prevents XSS attacks
- ✅ **JWT encryption** - Tokens are signed and verified
- ✅ **Secure secret** - Uses `NEXTAUTH_SECRET` environment variable
- ✅ **Automatic cleanup** - Expired tokens are rejected

### IMPORTANT: Production Setup

⚠️ **CRITICAL**: Your current `NEXTAUTH_SECRET` is set to `'None'`, which is insecure!

**Generate a proper secret for production:**

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

Then update your `.env`:
```env
NEXTAUTH_SECRET='your_generated_secret_here'
```

## Customization Options

### Extend Session Duration
To change the session duration, modify `maxAge` in `lib/auth.ts`:

```typescript
session: {
  maxAge: 14 * 24 * 60 * 60, // 14 days
}
```

### Common Durations:
- **1 day**: `24 * 60 * 60`
- **7 days**: `7 * 24 * 60 * 60` (current)
- **14 days**: `14 * 24 * 60 * 60`
- **30 days**: `30 * 24 * 60 * 60`
- **1 year**: `365 * 24 * 60 * 60`

### Disable Auto-Extension
To prevent automatic session extension:

```typescript
session: {
  maxAge: 7 * 24 * 60 * 60,
  updateAge: 0, // Disable auto-extension
}
```

## Testing

### Test Session Persistence:
1. Log in to your application
2. Close the browser completely
3. Reopen the browser and visit the site
4. You should still be logged in (within 7 days)

### Test Session Expiry:
1. Log in
2. Manually set your system time forward by 8 days
3. Refresh the page
4. You should be logged out and redirected to login

## Troubleshooting

### Users Getting Logged Out Unexpectedly

**Possible causes:**
1. **Cookie issues**: Check browser settings allow cookies
2. **Domain mismatch**: Ensure `NEXTAUTH_URL` matches your domain
3. **Secret changed**: Don't change `NEXTAUTH_SECRET` in production

### Session Not Extending

**Check:**
1. Verify `updateAge` is set properly
2. Ensure user is making requests (not just leaving tab open)
3. Check browser console for errors

## Best Practices

1. ✅ **Use HTTPS in production** - Required for secure cookies
2. ✅ **Set proper CORS policies** - Prevent unauthorized access
3. ✅ **Monitor session metrics** - Track login patterns
4. ✅ **Implement rate limiting** - Prevent brute force attacks
5. ✅ **Use strong secrets** - 32+ random characters

## Additional Security Recommendations

### 1. Add Session Revocation
For sensitive actions, implement manual session invalidation:
- Store session version in database
- Increment version on password change
- Validate version in JWT callback

### 2. Add Remember Me Option
Give users control over session duration:
- Short session (1 day) for public computers
- Long session (30 days) for personal devices

### 3. Add Activity Tracking
Log user sessions for security auditing:
- Track IP addresses
- Monitor unusual login patterns
- Alert on suspicious activity

## Environment Variables Reference

Required for session management:
```env
NEXTAUTH_SECRET=<your-32-character-secret>
NEXTAUTH_URL=<your-app-url>
DATABASE_URL=<your-database-url>
```

## Related Files

- `lib/auth.ts` - Main authentication configuration
- `.env` - Environment variables (not committed to git)
- `.env.example` - Template for environment variables
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes

## Questions?

- NextAuth.js Docs: https://next-auth.js.org/configuration/options#session
- JWT Security: https://jwt.io/introduction
