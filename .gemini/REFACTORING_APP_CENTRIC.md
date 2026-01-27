# Dashboard Refactoring - App-Centric Architecture

## Changes Overview

Refactoring from **company-level dashboard** to **app-centric dashboard** where each application has its own isolated:
- Feedback
- Analytics
- Users
- Settings

## Old Structure (REMOVED)
```
/dashboard → Analytics (company-wide)
/dashboard/feedback → All feedback
/dashboard/users → All users
/dashboard/settings → Company settings
/dashboard/applications → App management
```

## New Structure
```
/dashboard → Applications list (landing page)
/dashboard/[appId]/feedback → App-specific feedback
/dashboard/[appId]/analytics → App-specific analytics
/dashboard/[appId]/users → App-specific users
/dashboard/[appId]/settings → App-specific settings
```

## Files Changed

### Moved/Restructured:
- `app/dashboard/page.tsx` → Shows applications list (from applications page)
- `app/dashboard/[appId]/feedback/page.tsx` → New structure
- `app/dashboard/[appId]/analytics/page.tsx` → New structure
- `app/dashboard/[appId]/users/page.tsx` → New structure
- `app/dashboard/[appId]/settings/page.tsx` → New structure
- `app/dashboard/[appId]/layout.tsx` → App context layout

### Deleted:
- `app/dashboard/applications/*` (merged into main dashboard)
- Old `/dashboard/feedback` (moved to per-app)
- Old `/dashboard/users` (moved to per-app)
- Old analytics page (moved to per-app)

### Updated:
- `components/dashboard-sidebar.tsx` → Shows app context and per-app navigation
- All API endpoints → Filter by applicationId
