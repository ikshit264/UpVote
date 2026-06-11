const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(rows, columns) {
  const header = columns.map(c => csvEscape(c.label)).join(',');
  const body = rows.map(r => columns.map(c => csvEscape(c.get(r))).join(',')).join('\n');
  return header + '\n' + body + '\n';
}

function iso(d) { return d ? new Date(d).toISOString() : ''; }

function isPaid(sub) {
  if (!sub) return false;
  const paidPlans = new Set(['PRO', 'ENTERPRISE']);
  const activeStatuses = new Set(['ACTIVE', 'TRIALING', 'PAST_DUE']);
  return paidPlans.has(sub.plan) && activeStatuses.has(sub.status);
}

(async () => {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      applications: { orderBy: { createdAt: 'asc' } },
      subscription: true,
    },
  });

  // === USERS SHEET ===
  const userRows = [];
  for (const c of companies) {
    const sub = c.subscription;
    const paid = isPaid(sub);
    const authMethods = [
      c.passwordHash ? 'password' : null,
      c.googleId ? 'google' : null,
    ].filter(Boolean).join('+') || 'none';

    userRows.push({
      name: c.name,
      email: c.email,
      companyId: c.id,
      isEntrextTeam: c.isEntrextTeam,
      authMethods,
      signedUpAt: iso(c.createdAt),
      projectCount: c.applications.length,
      firstProjectAt: c.applications[0] ? iso(c.applications[0].createdAt) : '',
      lastProjectAt: c.applications[c.applications.length - 1] ? iso(c.applications[c.applications.length - 1].createdAt) : '',
      plan: sub?.plan || 'NONE',
      subscriptionStatus: sub?.status || '',
      hasPaid: paid ? 'YES' : 'NO',
      dodoCustomerId: sub?.dodoCustomerId || '',
      dodoSubscriptionId: sub?.dodoSubscriptionId || '',
      dodoProductId: sub?.dodoProductId || '',
      currentPeriodStart: iso(sub?.currentPeriodStart),
      currentPeriodEnd: iso(sub?.currentPeriodEnd),
      trialEnd: iso(sub?.trialEnd),
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? '',
    });
  }

  const userColumns = [
    { label: 'Name',                get: r => r.name },
    { label: 'Email',               get: r => r.email },
    { label: 'CompanyId',           get: r => r.companyId },
    { label: 'IsEntrextTeam',       get: r => r.isEntrextTeam },
    { label: 'AuthMethods',         get: r => r.authMethods },
    { label: 'SignedUpAt',          get: r => r.signedUpAt },
    { label: 'ProjectCount',        get: r => r.projectCount },
    { label: 'FirstProjectAt',      get: r => r.firstProjectAt },
    { label: 'LastProjectAt',       get: r => r.lastProjectAt },
    { label: 'Plan',                get: r => r.plan },
    { label: 'SubscriptionStatus',  get: r => r.subscriptionStatus },
    { label: 'HasPaid',             get: r => r.hasPaid },
    { label: 'DodoCustomerId',      get: r => r.dodoCustomerId },
    { label: 'DodoSubscriptionId',  get: r => r.dodoSubscriptionId },
    { label: 'DodoProductId',       get: r => r.dodoProductId },
    { label: 'CurrentPeriodStart',  get: r => r.currentPeriodStart },
    { label: 'CurrentPeriodEnd',    get: r => r.currentPeriodEnd },
    { label: 'TrialEnd',            get: r => r.trialEnd },
    { label: 'CancelAtPeriodEnd',   get: r => r.cancelAtPeriodEnd },
  ];

  // === PROJECTS SHEET ===
  const projectRows = [];
  for (const c of companies) {
    for (const a of c.applications) {
      const [fb, votes, support, replies] = await Promise.all([
        prisma.feedback.count({ where: { applicationId: a.id } }),
        prisma.vote.count({ where: { applicationId: a.id } }),
        prisma.support.count({ where: { applicationId: a.id } }),
        prisma.reply.count({ where: { feedback: { applicationId: a.id } } }),
      ]);
      projectRows.push({
        projectName: a.name,
        applicationId: a.id,
        createdAt: iso(a.createdAt),
        ownerName: c.name,
        ownerEmail: c.email,
        ownerCompanyId: c.id,
        ownerIsEntrextTeam: c.isEntrextTeam,
        ownerPlan: c.subscription?.plan || 'NONE',
        ownerHasPaid: isPaid(c.subscription) ? 'YES' : 'NO',
        feedbackCount: fb,
        voteCount: votes,
        supportCount: support,
        replyCount: replies,
      });
    }
  }

  const projectColumns = [
    { label: 'ProjectName',          get: r => r.projectName },
    { label: 'ApplicationId',        get: r => r.applicationId },
    { label: 'CreatedAt',            get: r => r.createdAt },
    { label: 'OwnerName',            get: r => r.ownerName },
    { label: 'OwnerEmail',           get: r => r.ownerEmail },
    { label: 'OwnerCompanyId',       get: r => r.ownerCompanyId },
    { label: 'OwnerIsEntrextTeam',   get: r => r.ownerIsEntrextTeam },
    { label: 'OwnerPlan',            get: r => r.ownerPlan },
    { label: 'OwnerHasPaid',         get: r => r.ownerHasPaid },
    { label: 'FeedbackCount',        get: r => r.feedbackCount },
    { label: 'VoteCount',            get: r => r.voteCount },
    { label: 'SupportCount',         get: r => r.supportCount },
    { label: 'ReplyCount',           get: r => r.replyCount },
  ];

  const dir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const usersFile = path.join(dir, `users-${stamp}.csv`);
  const projectsFile = path.join(dir, `projects-${stamp}.csv`);

  fs.writeFileSync(usersFile, toCsv(userRows, userColumns));
  fs.writeFileSync(projectsFile, toCsv(projectRows, projectColumns));

  console.log(`Wrote ${userRows.length} user rows -> ${usersFile}`);
  console.log(`Wrote ${projectRows.length} project rows -> ${projectsFile}`);

  // Also print a quick console summary
  console.log('\n=== USER SUMMARY ===');
  console.log(['Name', 'Email', 'SignedUp', 'Plan', 'Paid?', 'Projects'].join(' | '));
  for (const r of userRows) {
    console.log([r.name, r.email, r.signedUpAt.slice(0, 10), r.plan, r.hasPaid, r.projectCount].join(' | '));
  }

  const paidCount = userRows.filter(r => r.hasPaid === 'YES').length;
  console.log(`\nTotal users: ${userRows.length} | Paying: ${paidCount} | Projects: ${projectRows.length}`);

  await prisma.$disconnect();
})();
