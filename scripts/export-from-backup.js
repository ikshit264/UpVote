/*
 * Builds users.csv + projects.csv from the on-disk backups, since Atlas is
 * currently unreachable.
 *
 * Sources:
 *   tmp/backup-2026-05-23T13-51-59-054Z.json  - full snapshot before the merge
 *   tmp/backup-shift-2026-06-02T14-04-17-862Z.json - applications snapshot
 *                                                   taken right before the shift
 *
 * Current state reconstruction:
 *   - Companies: 2026-05-23 minus the 5 we deleted (Teams 0,3,4,5,6)
 *   - Applications: take 2026-06-02 applications (= post-merge, pre-shift),
 *                   then apply the shift (Nurturely/CurioCafe/Soho Space/
 *                   PickSpy/FutureFit/OpinVox: Team 2 -> Team 1)
 *   - Subscriptions/UsageMetrics: 2026-05-23 minus the rows for deleted companies
 *   - Feedback/votes/support/reply/tag counts: from 2026-05-23 snapshot
 *     (last-known values; new data after that date will NOT be reflected)
 */

const fs = require('fs');
const path = require('path');

const TMP = path.resolve(__dirname, '..', 'tmp');
const MERGE_BACKUP = path.join(TMP, 'backup-2026-05-23T13-51-59-054Z.json');
const SHIFT_BACKUP = path.join(TMP, 'backup-shift-2026-06-02T14-04-17-862Z.json');

const TEAM_1 = '69a41de35cbcf4f0c89e8968';
const TEAM_2 = '69a41de35cbcf4f0c89e8969';
const DELETED_COMPANY_IDS = new Set([
  '69a41d73bc21688fb5a88fd5', // Team 0
  '69a41de35cbcf4f0c89e896a', // Team 3
  '69a41de45cbcf4f0c89e896b', // Team 4
  '69a41de45cbcf4f0c89e896c', // Team 5
  '69aa0f515190de9c73a65cc2', // Team 6
]);
const SHIFTED_APP_NAMES = new Set(
  ['Nurturely', 'CurioCafe', 'Soho Space', 'PickSpy', 'FutureFit', 'OpinVox'].map(s => s.toLowerCase().replace(/\s+/g, ''))
);

function getId(o) { return o.id || o._id; }
function csvEscape(v) {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function toCsv(rows, columns) {
  return [columns.map(c => csvEscape(c.label)).join(','), ...rows.map(r => columns.map(c => csvEscape(c.get(r))).join(','))].join('\n') + '\n';
}
function iso(d) { return d ? new Date(d).toISOString() : ''; }
function isPaid(sub) {
  if (!sub) return false;
  return ['PRO', 'ENTERPRISE'].includes(sub.plan) && ['ACTIVE', 'TRIALING', 'PAST_DUE'].includes(sub.status);
}
function norm(s) { return s.toLowerCase().replace(/\s+/g, ''); }

const merge = JSON.parse(fs.readFileSync(MERGE_BACKUP, 'utf8'));
const shift = JSON.parse(fs.readFileSync(SHIFT_BACKUP, 'utf8'));

// === Reconstruct current state ===
const companies = merge.companies.filter(c => !DELETED_COMPANY_IDS.has(getId(c)));

// Applications: start from the shift backup (post-merge state) and apply the shift in memory
const applications = shift.applications.map(a => {
  const copy = { ...a };
  if (SHIFTED_APP_NAMES.has(norm(copy.name)) && copy.companyId === TEAM_2) {
    copy.companyId = TEAM_1;
  }
  return copy;
});

const subscriptions = merge.subscriptions.filter(s => !DELETED_COMPANY_IDS.has(s.companyId));
const feedback = merge.feedback;
const votes = merge.votes;
const support = merge.support;
const replies = merge.replies;
const tags = merge.tags;

// Build indexes
const subByCompany = new Map(subscriptions.map(s => [s.companyId, s]));
const fbByApp = new Map();
const votesByApp = new Map();
const supportByApp = new Map();
const fbIdToApp = new Map();
const replyByFeedback = new Map();
const tagsByFeedback = new Map();
for (const f of feedback) {
  fbIdToApp.set(getId(f), f.applicationId);
  fbByApp.set(f.applicationId, (fbByApp.get(f.applicationId) || 0) + 1);
}
for (const v of votes) votesByApp.set(v.applicationId, (votesByApp.get(v.applicationId) || 0) + 1);
for (const s of support) supportByApp.set(s.applicationId, (supportByApp.get(s.applicationId) || 0) + 1);
for (const r of replies) replyByFeedback.set(r.feedbackId, 1);
for (const t of tags) tagsByFeedback.set(t.feedbackId, (tagsByFeedback.get(t.feedbackId) || 0) + 1);

function repliesForApp(appId) {
  let n = 0;
  for (const [fId, appOfF] of fbIdToApp.entries()) {
    if (appOfF === appId && replyByFeedback.get(fId)) n++;
  }
  return n;
}

// === USERS ===
const appsByCompany = new Map();
for (const a of applications) {
  if (!appsByCompany.has(a.companyId)) appsByCompany.set(a.companyId, []);
  appsByCompany.get(a.companyId).push(a);
}

companies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

const userRows = [];
for (const c of companies) {
  const cid = getId(c);
  const apps = (appsByCompany.get(cid) || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const sub = subByCompany.get(cid);
  const auth = [c.passwordHash ? 'password' : null, c.googleId ? 'google' : null].filter(Boolean).join('+') || 'none';
  userRows.push({
    name: c.name,
    email: c.email,
    companyId: cid,
    isEntrextTeam: c.isEntrextTeam,
    auth,
    signedUpAt: iso(c.createdAt),
    projectCount: apps.length,
    firstProjectAt: apps[0] ? iso(apps[0].createdAt) : '',
    lastProjectAt: apps[apps.length - 1] ? iso(apps[apps.length - 1].createdAt) : '',
    plan: sub?.plan || 'NONE',
    status: sub?.status || '',
    hasPaid: isPaid(sub) ? 'YES' : 'NO',
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
  { label: 'Name', get: r => r.name },
  { label: 'Email', get: r => r.email },
  { label: 'CompanyId', get: r => r.companyId },
  { label: 'IsEntrextTeam', get: r => r.isEntrextTeam },
  { label: 'AuthMethods', get: r => r.auth },
  { label: 'SignedUpAt', get: r => r.signedUpAt },
  { label: 'ProjectCount', get: r => r.projectCount },
  { label: 'FirstProjectAt', get: r => r.firstProjectAt },
  { label: 'LastProjectAt', get: r => r.lastProjectAt },
  { label: 'Plan', get: r => r.plan },
  { label: 'SubscriptionStatus', get: r => r.status },
  { label: 'HasPaid', get: r => r.hasPaid },
  { label: 'DodoCustomerId', get: r => r.dodoCustomerId },
  { label: 'DodoSubscriptionId', get: r => r.dodoSubscriptionId },
  { label: 'DodoProductId', get: r => r.dodoProductId },
  { label: 'CurrentPeriodStart', get: r => r.currentPeriodStart },
  { label: 'CurrentPeriodEnd', get: r => r.currentPeriodEnd },
  { label: 'TrialEnd', get: r => r.trialEnd },
  { label: 'CancelAtPeriodEnd', get: r => r.cancelAtPeriodEnd },
];

// === PROJECTS ===
const projectRows = [];
const companyById = new Map(companies.map(c => [getId(c), c]));
for (const a of applications) {
  const c = companyById.get(a.companyId);
  if (!c) continue; // orphaned, skip
  const sub = subByCompany.get(a.companyId);
  projectRows.push({
    projectName: a.name,
    applicationId: getId(a),
    createdAt: iso(a.createdAt),
    ownerName: c.name,
    ownerEmail: c.email,
    ownerCompanyId: getId(c),
    ownerIsEntrextTeam: c.isEntrextTeam,
    ownerPlan: sub?.plan || 'NONE',
    ownerHasPaid: isPaid(sub) ? 'YES' : 'NO',
    feedbackCount: fbByApp.get(getId(a)) || 0,
    voteCount: votesByApp.get(getId(a)) || 0,
    supportCount: supportByApp.get(getId(a)) || 0,
    replyCount: repliesForApp(getId(a)),
  });
}
projectRows.sort((a, b) => a.ownerEmail.localeCompare(b.ownerEmail) || a.createdAt.localeCompare(b.createdAt));

const projectColumns = [
  { label: 'ProjectName', get: r => r.projectName },
  { label: 'ApplicationId', get: r => r.applicationId },
  { label: 'CreatedAt', get: r => r.createdAt },
  { label: 'OwnerName', get: r => r.ownerName },
  { label: 'OwnerEmail', get: r => r.ownerEmail },
  { label: 'OwnerCompanyId', get: r => r.ownerCompanyId },
  { label: 'OwnerIsEntrextTeam', get: r => r.ownerIsEntrextTeam },
  { label: 'OwnerPlan', get: r => r.ownerPlan },
  { label: 'OwnerHasPaid', get: r => r.ownerHasPaid },
  { label: 'FeedbackCount(asOf 2026-05-23)', get: r => r.feedbackCount },
  { label: 'VoteCount(asOf 2026-05-23)', get: r => r.voteCount },
  { label: 'SupportCount(asOf 2026-05-23)', get: r => r.supportCount },
  { label: 'ReplyCount(asOf 2026-05-23)', get: r => r.replyCount },
];

const usersFile = path.join(TMP, `users-fromBackup-2026-06-03.csv`);
const projectsFile = path.join(TMP, `projects-fromBackup-2026-06-03.csv`);
fs.writeFileSync(usersFile, toCsv(userRows, userColumns));
fs.writeFileSync(projectsFile, toCsv(projectRows, projectColumns));

console.log(`Wrote ${userRows.length} users -> ${usersFile}`);
console.log(`Wrote ${projectRows.length} projects -> ${projectsFile}`);

console.log('\n=== USERS ===');
console.log(['Name', 'Email', 'SignedUp', 'Plan', 'Paid?', 'Projects'].join(' | '));
for (const r of userRows) {
  console.log([r.name, r.email, r.signedUpAt.slice(0, 10), r.plan, r.hasPaid, r.projectCount].join(' | '));
}
const paid = userRows.filter(r => r.hasPaid === 'YES').length;
console.log(`\nTotal: ${userRows.length} users | ${paid} paying | ${projectRows.length} projects`);
console.log('\nNOTE: project counts (feedback/votes/support/replies) are as of 2026-05-23. Company/project assignments are current.');
