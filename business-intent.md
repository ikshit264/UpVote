## Product Overview
- Product Type: SaaS Customer Feedback & Prioritization Platform
- Primary Function: Providing an embeddable feedback/voting widget and a management dashboard for product teams.
- Target Audience: Product Managers, Startup Founders, SaaS Companies, and Developers.
- Monetization Model: Tiered Freemium (Hobby: free, Pro: $29-39/mo, Enterprise: custom pricing).
- Deployment Type: Cloud-based Web Application (Next.js + PostgreSQL).

## Core Capabilities
- Feature 1: Universal Embeddable Widget — Lightweight JS script to collect feedback on any website.
- Feature 2: Feature Voting System — Allows users to upvote feedback items to help prioritize development.
- Feature 3: Multi-App Dashboard — Centralized interface to manage multiple products or environments.
- Feature 4: Feedback Lifecycle Management — Tools to track feedback from submission to resolution (Status: Open, Planned, etc.).
- Feature 5: Cross-Framework Integrations — Dedicated guides and snippets for React, Vue, Angular, and Vanilla HTML.

## Surface Classification

### Public Pages (Indexable Candidates)
| Route | Purpose | Confidence |
|------|--------|-----------|
| / | Main Landing Page (Hero, Features, Pricing, Social Proof) | High |
| /auth/login | User Authentication Entry | High |
| /auth/signup | Account Creation / Onboarding Entry | High |
| /privacy | Data protection and privacy commitment | High |
| /ifo | Platform information and mission | High |

### Private / App Pages (Never Index)
| Route Pattern | Reason | Confidence |
|--------------|--------|-----------|
| /dashboard | Parent dashboard for application overview | High |
| /dashboard/[appId] | Application-specific analytics and feedback management | High |
| /dashboard/[appId]/feedback | CRUD operations for user feedback items | High |
| /dashboard/[appId]/settings | API keys and sensitive widget configuration | High |
| /api/* | Backend API endpoints including payments and data mutations | High |

## User Journey
- Entry Point: Landing page or Technical Integration Documentation.
- Core Interaction: Creating an account, configuring an application, and embedding the widget into a third-party site.
- Conversion Action: Upgrading from the "Hobby" plan to the "Pro" plan via Dodo Payments for unlimited projects.
- Post-Conversion State: Managing high-volume user feedback and using analytics to drive product roadmap decisions.

## Content Signals
- Blog Detected: No
- FAQ Detected: No (Support section exists but no dedicated FAQ route)
- Guides / Docs: Yes (Integration markdown files for various frameworks: React, Angular, Vue, HTML)
- Trust Pages Detected: Yes (Privacy, Platform Information)

## SEO-Safe Assumptions
- What this product IS: A B2B feedback collection tool focused on feature prioritization via user voting.
- What this product IS NOT: A customer support helpdesk, a CRM, or a generic survey tool like Typeform.

## Confidence Summary
- Overall Confidence Score (0–1): 0.92
- High Confidence Areas: Core product functionality, monetization model, technology stack, and route structure.
- Low Confidence Areas: Searchability of documentation files vs landing page content; existence of legal/trust documentation.

## SEO Execution Constraints
- Routes that must never be indexed: All `/dashboard` sub-paths and `/api` routes.
- Routes safe for canonicalization: `/` (Landing Page).
- Areas requiring conservative SEO: Documentation snippets (ensure they don't trigger duplicate content flags if also hosted on subdomains).
