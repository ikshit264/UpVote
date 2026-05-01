/**
 * Seed Feedback & Support Script
 * 
 * Usage:
 *   npx tsx scripts/seed-feedback-support.ts <applicationId>
 *
 * Creates 1-3 feedbacks and 0-2 support tickets per day
 * for the past 30 days (from yesterday back).
 * Uses the DATABASE_URL from .env automatically via Prisma.
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Realistic data pools Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const FEEDBACK_POOL: { title: string; description: string; status: string; tags: string[] }[] = [
  { title: "Dark mode support", description: "It would be great to have a dark mode option for the dashboard. Working late at night with the bright UI is straining on the eyes.", status: "Open", tags: ["ui", "feature-request"] },
  { title: "Export data to CSV", description: "We need the ability to export our feedback data to CSV or Excel for offline analysis and reporting to stakeholders.", status: "Open", tags: ["export", "feature-request"] },
  { title: "Mobile responsive issues", description: "The sidebar overlaps with the main content area on mobile devices (tested on iPhone 15 and Samsung Galaxy S24).", status: "Open", tags: ["bug", "mobile"] },
  { title: "Bulk actions for feedback", description: "Allow selecting multiple feedback items and performing bulk actions like changing status, adding tags, or deleting.", status: "Open", tags: ["feature-request", "productivity"] },
  { title: "Email notifications for new feedback", description: "As a product manager, I'd love to receive email notifications whenever new feedback is submitted so I can respond quickly.", status: "Under Review", tags: ["notifications", "feature-request"] },
  { title: "Improve loading speed", description: "The dashboard takes about 4-5 seconds to load when we have more than 200 feedback entries. Performance optimization would be appreciated.", status: "Open", tags: ["performance", "bug"] },
  { title: "Add feedback categories", description: "Currently all feedbacks are in one list. Having categories like 'Bug Report', 'Feature Request', 'Improvement' would help organize better.", status: "Open", tags: ["organization", "feature-request"] },
  { title: "Integrate with Slack", description: "Our team uses Slack heavily. A Slack integration to post new feedback into a channel would streamline our workflow.", status: "Open", tags: ["integration", "feature-request"] },
  { title: "Voting system improvements", description: "The monkfeed/downvote UI is not very intuitive. Consider adding vote counts visibly and maybe a 'trending' sort option.", status: "Under Review", tags: ["ui", "improvement"] },
  { title: "Search and filter feedback", description: "We have hundreds of feedback items. Need a robust search with filters by status, date range, tags, and vote count.", status: "Open", tags: ["search", "feature-request"] },
  { title: "Custom branding for widget", description: "Allow us to fully customize the widget colors, fonts and logo so it matches our product's brand identity.", status: "Open", tags: ["widget", "customization"] },
  { title: "Duplicate detection", description: "Users are submitting similar feedback multiple times. An AI-based duplicate detection would save us time on triaging.", status: "Open", tags: ["ai", "feature-request"] },
  { title: "Feedback analytics dashboard", description: "A dedicated analytics page showing trends, sentiment analysis, most requested features, and response times would be invaluable.", status: "Open", tags: ["analytics", "feature-request"] },
  { title: "Multi-language support", description: "Our product serves users globally. Feedback widget and dashboard in multiple languages (Spanish, French, German at minimum) is needed.", status: "Open", tags: ["i18n", "feature-request"] },
  { title: "API rate limiting issues", description: "When we send bursts of feedback via the API, we occasionally get 429 errors. Please increase rate limits or provide better docs on limits.", status: "Open", tags: ["api", "bug"] },
  { title: "Keyboard shortcuts", description: "Power users would benefit from keyboard shortcuts for common actions like navigating between feedbacks, changing status, etc.", status: "Open", tags: ["ux", "feature-request"] },
  { title: "Attachment support", description: "Users should be able to attach screenshots or files to their feedback to better illustrate issues they're reporting.", status: "Under Review", tags: ["feature-request", "uploads"] },
  { title: "Roadmap view", description: "A public roadmap page that automatically populates from feedback status changes would be amazing for transparency.", status: "Open", tags: ["roadmap", "feature-request"] },
  { title: "SSO login support", description: "Our enterprise clients require SAML/SSO based login. Without it, adoption is blocked for several accounts.", status: "Open", tags: ["enterprise", "authentication"] },
  { title: "Feedback priority scoring", description: "Automatically score and rank feedback based on vote count, user segment, and recency to help us prioritize the backlog.", status: "Open", tags: ["prioritization", "feature-request"] },
  { title: "Widget loading is slow on Safari", description: "The embedded widget takes noticeably longer to load on Safari compared to Chrome. Possible WebKit compatibility issue.", status: "Open", tags: ["bug", "performance", "safari"] },
  { title: "Add changelog feature", description: "Let us publish changelogs so users can see what feedback has been acted upon. Closes the feedback loop.", status: "Open", tags: ["feature-request", "changelog"] },
  { title: "Better onboarding flow", description: "First-time setup is confusing. A step-by-step wizard or tutorial would help new users get started faster.", status: "Open", tags: ["onboarding", "ux"] },
  { title: "Role-based access control", description: "Need different permission levels: admin, editor, viewer. Currently everyone has full access which is a security concern.", status: "Open", tags: ["security", "feature-request"] },
  { title: "Webhook support for events", description: "Trigger webhooks when feedback is created, updated, or status changes so we can integrate with our internal tools.", status: "Open", tags: ["integration", "webhooks"] },
  { title: "Date range filter on dashboard", description: "Allow filtering the dashboard view by custom date ranges to see feedback trends over specific periods.", status: "Open", tags: ["filter", "dashboard"] },
  { title: "Merge duplicate feedback items", description: "When duplicates are found, we should be able to merge them into one item while preserving all votes and comments.", status: "Open", tags: ["deduplication", "feature-request"] },
  { title: "Widget accessibility improvements", description: "The widget doesn't fully comply with WCAG 2.1 AA. Screen reader support and keyboard navigation need work.", status: "Open", tags: ["accessibility", "widget"] },
  { title: "Auto-close stale feedback", description: "Feedback items that haven't received activity in 90 days should be auto-closed or flagged for review.", status: "Open", tags: ["automation", "feature-request"] },
  { title: "Two-factor authentication", description: "For security-conscious teams, 2FA should be available as an option for account protection.", status: "Open", tags: ["security", "authentication"] },
  { title: "Real-time updates", description: "When another team member changes a feedback status, it should reflect in real-time without needing a page refresh.", status: "Open", tags: ["real-time", "ux"] },
  { title: "Feedback sentiment analysis", description: "Use NLP to automatically tag feedback as positive, negative, or neutral to quickly gauge user sentiment.", status: "Open", tags: ["ai", "analytics"] },
  { title: "Custom status workflows", description: "The default statuses (Open, Under Review, Closed) don't match our workflow. Let us define custom status names and transitions.", status: "Open", tags: ["customization", "workflow"] },
  { title: "Embed widget in React Native app", description: "We have a React Native mobile app and need a way to embed the feedback widget natively, not just via WebView.", status: "Open", tags: ["mobile", "sdk"] },
  { title: "User segmentation for feedback", description: "Tag feedback by user plan (free, pro, enterprise) so we can prioritize feedback from paying customers.", status: "Open", tags: ["segmentation", "feature-request"] },
  { title: "Improved error messages", description: "When API calls fail, the error messages are generic. More descriptive errors would help us debug integration issues faster.", status: "Open", tags: ["api", "dx"] },
  { title: "Batch import feedback", description: "We're migrating from another tool and need to import 500+ existing feedback items. A CSV import feature would help.", status: "Open", tags: ["import", "migration"] },
  { title: "Comment threading on feedback", description: "Allow threaded discussions on feedback items so team members and users can have structured conversations.", status: "Open", tags: ["collaboration", "feature-request"] },
  { title: "Audit log", description: "We need a detailed audit log showing who changed what and when for compliance and accountability purposes.", status: "Open", tags: ["compliance", "enterprise"] },
  { title: "Dashboard widget for Notion", description: "A Notion embed or widget that shows our top feedback items directly in our product wiki would be very useful.", status: "Open", tags: ["integration", "notion"] },
];

const SUPPORT_POOL: { email: string; message: string }[] = [
  { email: "john.doe@acme.com", message: "Hi, I'm unable to log into my account after the recent update. It says 'invalid credentials' even though I'm sure the password is correct. Can you help?" },
  { email: "sarah.k@techstart.io", message: "We're trying to embed the feedback widget on our Next.js app but it's throwing a hydration error. Here's the error: 'Text content does not match server-rendered HTML'. Please advise." },
  { email: "mike@devhouse.co", message: "Is there a way to programmatically submit feedback via your API? I couldn't find API documentation anywhere on the site." },
  { email: "priya.sharma@bigcorp.in", message: "Our subscription was charged twice this month. Order IDs: ORD-4821 and ORD-4823. Please process a refund for the duplicate charge." },
  { email: "alex.m@startup.dev", message: "Love the product! Quick question Ã¢â‚¬â€ is there a way to white-label the widget so our brand name shows instead of yours?" },
  { email: "laura@designlab.co", message: "The feedback widget is not showing up on our website after following the integration guide. We're using Webflow. Any specific steps for Webflow sites?" },
  { email: "raj.patel@enterprise.com", message: "We need to discuss enterprise pricing for our organization (500+ users). Can someone from your sales team reach out?" },
  { email: "emma.wilson@saas.io", message: "How do I delete a feedback item? I accidentally posted test data and now it's showing up in our public board." },
  { email: "carlos@freelancer.net", message: "Is there a free tier available? I'm a solo developer and the current pricing is a bit steep for my side project." },
  { email: "nina.r@agency.co", message: "We're managing multiple client projects. Is there a way to switch between different applications without logging out and back in?" },
  { email: "tom.harris@corp.org", message: "Can you provide a SOC 2 compliance report? Our security team requires it before we can proceed with procurement." },
  { email: "jessica@ecommerce.shop", message: "The feedback form submission is failing with a 500 error when users type emojis in their feedback. This seems like a character encoding issue." },
  { email: "david.chen@mobile.app", message: "Is there a Flutter SDK available? We need native mobile integration and the JavaScript widget doesn't work well in WebViews." },
  { email: "anna@nonprofit.org", message: "Do you offer any discounts for non-profit organizations? We'd love to use your platform but have limited budget." },
  { email: "kevin.b@analytics.co", message: "The analytics numbers on the dashboard don't match what I see when I manually count the feedback items. There seems to be a discrepancy of about 15 items." },
  { email: "sophie@edtech.com", message: "We need to export all our data before our subscription ends next week. What export options are available and what format is the data in?" },
  { email: "marcus@fintech.io", message: "Is the data encrypted at rest? We handle sensitive financial feedback and need to ensure data security compliance." },
  { email: "lisa@healthapp.co", message: "Can we set up automated responses when users submit feedback? Something like 'Thank you for your feedback, we'll review it within 48 hours'." },
  { email: "robert.j@gaming.studio", message: "The widget conflicts with our existing CSS. Specifically, our .btn class styles are being overridden. Can you namespace your CSS classes?" },
  { email: "diana@travel.app", message: "We accidentally deleted an application and lost all feedback data. Is there any way to recover it? This happened about 2 hours ago." },
  { email: "hugo@marketplace.com", message: "How do we handle GDPR data deletion requests? If a user asks us to delete their data, how do we remove their feedback from your system?" },
  { email: "fiona@crm.tools", message: "Can we integrate your feedback widget with our CRM? Specifically, we'd like feedback to automatically create tickets in our support system." },
  { email: "ben@devops.cloud", message: "Getting intermittent timeouts when loading the dashboard. Started happening about 3 days ago. Our team is in the EU region Ã¢â‚¬â€ could this be a latency issue?" },
  { email: "claire@legal.firm", message: "We need a Data Processing Agreement (DPA) signed before onboarding. Can you send us your standard DPA template?" },
  { email: "omar@retail.co", message: "Is it possible to have different feedback boards for different product lines within the same application? Currently mixing all feedback together." },
];

const USER_IDS = [
  "user_ext_001", "user_ext_002", "user_ext_003", "user_ext_004", "user_ext_005",
  "user_ext_006", "user_ext_007", "user_ext_008", "user_ext_009", "user_ext_010",
  "user_ext_011", "user_ext_012", "user_ext_013", "user_ext_014", "user_ext_015",
  "user_ext_016", "user_ext_017", "user_ext_018", "user_ext_019", "user_ext_020",
  "user_ext_021", "user_ext_022", "user_ext_023", "user_ext_024", "user_ext_025",
  "user_ext_026", "user_ext_027", "user_ext_028", "user_ext_029", "user_ext_030",
];

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Remove and return a random item from the array (ensures uniqueness) */
function pickAndRemove<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr.splice(idx, 1)[0];
}

function randomTimeOnDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(randomInt(8, 22), randomInt(0, 59), randomInt(0, 59), randomInt(0, 999));
  return d;
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

async function main() {
  const applicationId = process.argv[2];

  if (!applicationId) {
    console.error("Ã¢ÂÅ’ Usage: npx tsx scripts/seed-feedback-support.ts <applicationId>");
    process.exit(1);
  }

  // Verify the application exists
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) {
    console.error(`Ã¢ÂÅ’ Application with ID "${applicationId}" not found.`);
    process.exit(1);
  }

  console.log(`\nÃ°Å¸Å¡â‚¬ Seeding data for application: "${app.name}" (${applicationId})\n`);

  // Build date range: past 30 days (yesterday Ã¢â€ â€™ 30 days ago)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  // Clone pools so we can pick without repeating
  const feedbackPool = [...FEEDBACK_POOL];
  const supportPool = [...SUPPORT_POOL];

  let totalFeedback = 0;
  let totalSupport = 0;
  let totalVotes = 0;
  let totalTags = 0;

  for (const date of dates) {
    const feedbackCount = randomInt(1, 3);
    const supportCount = randomInt(0, 2);

    const dateStr = date.toISOString().slice(0, 10);

    // Ã¢â€â‚¬Ã¢â€â‚¬ Create Feedbacks Ã¢â€â‚¬Ã¢â€â‚¬
    for (let f = 0; f < feedbackCount; f++) {
      if (feedbackPool.length === 0) {
        console.log("Ã¢Å¡Â Ã¯Â¸Â  Exhausted unique feedback pool, stopping feedback creation.");
        break;
      }

      const template = pickAndRemove(feedbackPool);
      const userId = pickRandom(USER_IDS);
      const createdAt = randomTimeOnDate(date);

      const feedback = await prisma.feedback.create({
        data: {
          applicationId,
          userId,
          title: template.title,
          description: template.description,
          status: template.status,
          createdAt,
          updatedAt: createdAt,
        },
      });

      // Create tags for this feedback
      for (const tagName of template.tags) {
        await prisma.tag.create({
          data: {
            feedbackId: feedback.id,
            name: tagName,
          },
        });
        totalTags++;
      }

      // Add 0-5 random votes to each feedback
      const voteCount = randomInt(0, 5);
      const voterPool = [...USER_IDS].filter((u) => u !== userId); // exclude feedback author
      for (let v = 0; v < voteCount && voterPool.length > 0; v++) {
        const voterId = pickAndRemove(voterPool);
        try {
          await prisma.vote.create({
            data: {
              applicationId,
              feedbackId: feedback.id,
              userId: voterId,
              voteType: Math.random() > 0.2 ? "UPVOTE" : "DOWNVOTE", // 80% monkfeeds
              createdAt: new Date(createdAt.getTime() + randomInt(60_000, 86_400_000)), // sometime after
            },
          });
          totalVotes++;
        } catch {
          // skip duplicate vote constraint violations
        }
      }

      totalFeedback++;
      console.log(`  Ã°Å¸â€œÂ [${dateStr}] Feedback: "${template.title}" (${template.tags.join(", ")})`);
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ Create Support tickets Ã¢â€â‚¬Ã¢â€â‚¬
    for (let s = 0; s < supportCount; s++) {
      if (supportPool.length === 0) {
        console.log("Ã¢Å¡Â Ã¯Â¸Â  Exhausted unique support pool, stopping support creation.");
        break;
      }

      const template = pickAndRemove(supportPool);
      const userId = pickRandom(USER_IDS);
      const createdAt = randomTimeOnDate(date);

      await prisma.support.create({
        data: {
          applicationId,
          userId,
          email: template.email,
          message: template.message,
          createdAt,
        },
      });

      totalSupport++;
      console.log(`  Ã°Å¸Å½Â« [${dateStr}] Support: ${template.email}`);
    }
  }

  console.log("\nÃ¢Å“â€¦ Seeding complete!");
  console.log(`   Ã°Å¸â€œÂ Feedbacks created : ${totalFeedback}`);
  console.log(`   Ã°Å¸â€”Â³Ã¯Â¸Â  Votes created     : ${totalVotes}`);
  console.log(`   Ã°Å¸ÂÂ·Ã¯Â¸Â  Tags created      : ${totalTags}`);
  console.log(`   Ã°Å¸Å½Â« Support tickets   : ${totalSupport}`);
  console.log(`   Ã°Å¸â€œâ€¦ Date range        : ${dates[dates.length - 1].toISOString().slice(0, 10)} Ã¢â€ â€™ ${dates[0].toISOString().slice(0, 10)}\n`);
}

main()
  .catch((e) => {
    console.error("Ã¢ÂÅ’ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
