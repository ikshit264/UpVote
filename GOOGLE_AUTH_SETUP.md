# Google OAuth Setup Guide for UpVote

Google Authentication has been successfully integrated into your UpVote application! 🎉

## What Was Changed

### 1. Database Schema (`prisma/schema.prisma`)
- Made `passwordHash` optional to support OAuth users  
- Added `googleId` field for storing Google OAuth identifiers

### 2. Auth Configuration (`lib/auth.ts`)
- Added GoogleProvider to NextAuth
- Implemented automatic user creation/linking for Google sign-ins
- Updated callbacks to handle both credential and OAuth authentication

### 3. Login & Signup Pages
- Added "Sign in with Google" buttons to both `/auth/login` and `/auth/signup`
- Users can now sign in with either email/password or Google account

### 4. Environment Variables (`.env`)
- Added `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Added `NEXTAUTH_URL` for proper OAuth callback handling

## Setup Instructions

To complete the Google OAuth integration, you need to get credentials from Google Cloud Console:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API" or "Google OAuth API"

### Step 2: Configure OAuth Consent Screen

1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (or "Internal" if for workspace only)
3. Fill in the required information:
   - **App name**: UpVote
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

### Step 3: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: UpVote Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - Your production URL (when deploying)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### Step 4: Update Environment Variables

1. Open your `.env` file
2. Replace the placeholder values:

\`\`\`env
GOOGLE_CLIENT_ID='your-actual-client-id-from-google'
GOOGLE_CLIENT_SECRET='your-actual-client-secret-from-google'
\`\`\`

3. Make sure `NEXTAUTH_URL` is set correctly:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

### Step 5: Restart Your Development Server

\`\`\`bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
\`\`\`

## Testing

1. Navigate to `http://localhost:3000/auth/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's sign-in page
4. After successful authentication, you'll be redirected to `/dashboard`

## How It Works

### For New Users
- When a user signs in with Google for the first time:
  - A new `Company` record is created automatically
  - Email from Google is used as the primary identifier
  - Google ID is stored for future authentications
  - Name is extracted from Google profile

### For Existing Users  
- If a user with the same email already exists (created via email/password):
  - The Google ID is linked to their existing account
  - They can now sign in with either method (email/password OR Google)

### Security Notes
- Users created via Google OAuth don't have a password set (`passwordHash` is `null`)
- These users can ONLY sign in via Google
- If you want to add password auth later, you'll need to implement a "Set Password" feature

## Production Deployment

When deploying to production:

1. Update OAuth consent screen with production domain
2. Add production URLs to authorized origins and redirect URIs in Google Console
3. Update `.env` or your hosting platform's environment variables with:
   - Production `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Production `NEXTAUTH_URL`
   - Generate a strong `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)

## Troubleshooting

### "Error: Failed to sign in with Google"
- Check that your Client ID and Secret are correct in `.env`
- Verify authorized redirect URIs include the exact callback URL
- Ensure the OAuth consent screen is properly configured

### "Redirect URI mismatch" error
- The redirect URI in Google Console must exactly match:
  `http://localhost:3000/api/auth/callback/google` (dev)
  or `https://yourdomain.com/api/auth/callback/google` (prod)

### TypeScript errors in `lib/auth.ts`
- Run `npx prisma generate` to regenerate Prisma client with new schema
- The errors should resolve after Prisma client regeneration

## Need Help?

- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Note**: The `.env` file currently contains placeholder values. Make sure to replace them with your actual Google OAuth credentials before testing!
