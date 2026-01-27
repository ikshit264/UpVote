# 🔧 Fix for "Company not found" Error

## Problem
After the database migration to add subscription support, the Prisma client is out of sync. This causes:
1. Lint errors about missing `subscription` property
2. Runtime errors when accessing subscription data
3. New Google OAuth users may not have subscriptions created

## Solution

### Step 1: Stop the Dev Server
**You need to restart the dev server** to release file locks and regenerate the Prisma client.

1. Press `Ctrl+C` in your terminal to stop `npm run dev`

### Step 2: Regenerate Prisma Client
Run this command:
```bash
npx prisma generate
```

### Step 3: Fix Existing Companies
Run the fix script to ensure all existing companies have FREE subscriptions:
```bash
npx tsx scripts/fix-subscriptions.ts
```

If `tsx` is not installed:
```bash
npm install -D tsx
npx tsx scripts/fix-subscriptions.ts
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

## What Was Changed

### 1. Auth Callback Updated
**File:** `lib/auth.ts`

The Google OAuth callback now creates a default FREE subscription when creating new companies:

```typescript
// Create new company with default FREE subscription
const newCompany = await prisma.company.create({
  data: {
    email,
    googleId,
    name: user.name || email.split('@')[0],
    passwordHash: null,
    subscription: {
      create: {
        plan: 'FREE',
        status: 'ACTIVE',
      }
    }
  }
});
```

### 2. Fix Script Created
**File:** `scripts/fix-subscriptions.ts`

This script:
- Finds all companies without subscriptions
- Creates default FREE subscriptions for them
- Ensures database consistency

## Verification

After completing the steps above, verify:

1. ✅ No lint errors in TypeScript files
2. ✅ Dev server starts successfully
3. ✅ You can access `/dashboard/settings` without errors
4. ✅ New OAuth users get subscriptions automatically

## Your Current Issue

Your Google OAuth user (ID: `112873294439942614334`) successfully authenticated but the company was created before the subscription feature was added. Running the fix script will create a FREE subscription for this user.

After these steps, you'll be able to:
- Access all pages without "Company not found" errors
- See your subscription status (FREE plan)
- Create projects and feedback (with limits enforced)
