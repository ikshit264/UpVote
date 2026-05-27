/*
 * One-shot maintenance script:
 *   - Backs up Company / Application / Feedback / Vote / Support / Reply / Tag / Subscription / UsageMetrics
 *   - Re-parents Applications: Teams 0,3 -> Team 1 ;  Teams 4,5,6 -> Team 2
 *   - Deletes Company records for Teams 0,3,4,5,6 (cascades Subscription + UsageMetrics)
 *   - Leaves passwords and personal (non-entrext) accounts untouched
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TEAM_1 = '69a41de35cbcf4f0c89e8968'; // survivor
const TEAM_2 = '69a41de35cbcf4f0c89e8969'; // survivor

const MERGE_INTO_TEAM_1 = [
  '69a41d73bc21688fb5a88fd5', // Team 0
  '69a41de35cbcf4f0c89e896a', // Team 3
];

const MERGE_INTO_TEAM_2 = [
  '69a41de45cbcf4f0c89e896b', // Team 4
  '69a41de45cbcf4f0c89e896c', // Team 5
  '69aa0f515190de9c73a65cc2', // Team 6
];

const TO_DELETE = [...MERGE_INTO_TEAM_1, ...MERGE_INTO_TEAM_2];

async function backup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `backup-${stamp}.json`);

  const payload = {
    takenAt: new Date().toISOString(),
    companies: await prisma.company.findMany(),
    applications: await prisma.application.findMany(),
    feedback: await prisma.feedback.findMany(),
    votes: await prisma.vote.findMany(),
    support: await prisma.support.findMany(),
    replies: await prisma.reply.findMany(),
    tags: await prisma.tag.findMany(),
    subscriptions: await prisma.subscription.findMany(),
    usageMetrics: await prisma.usageMetrics.findMany(),
  };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  console.log(`Backup written: ${file}`);
  console.log(`  companies=${payload.companies.length} applications=${payload.applications.length}`);
  console.log(`  feedback=${payload.feedback.length} votes=${payload.votes.length} support=${payload.support.length}`);
  console.log(`  replies=${payload.replies.length} tags=${payload.tags.length}`);
  console.log(`  subscriptions=${payload.subscriptions.length} usageMetrics=${payload.usageMetrics.length}`);
  return file;
}

async function preflight() {
  console.log('\n--- PREFLIGHT ---');
  for (const id of [TEAM_1, TEAM_2, ...TO_DELETE]) {
    const c = await prisma.company.findUnique({ where: { id } });
    if (!c) throw new Error(`Expected company not found: ${id}`);
    const apps = await prisma.application.count({ where: { companyId: id } });
    console.log(`  ${c.name.padEnd(8)} (${c.email}) id=${id} apps=${apps}`);
  }
}

async function migrate() {
  console.log('\n--- MIGRATING APPLICATIONS ---');
  const r1 = await prisma.application.updateMany({
    where: { companyId: { in: MERGE_INTO_TEAM_1 } },
    data: { companyId: TEAM_1 },
  });
  console.log(`  -> Team 1 : reparented ${r1.count} applications`);

  const r2 = await prisma.application.updateMany({
    where: { companyId: { in: MERGE_INTO_TEAM_2 } },
    data: { companyId: TEAM_2 },
  });
  console.log(`  -> Team 2 : reparented ${r2.count} applications`);
}

async function verifyNoOrphans() {
  console.log('\n--- VERIFY ---');
  for (const id of TO_DELETE) {
    const left = await prisma.application.count({ where: { companyId: id } });
    if (left !== 0) throw new Error(`Aborting: ${id} still has ${left} applications`);
    console.log(`  ${id} : 0 remaining applications OK`);
  }
}

async function deleteCompanies() {
  console.log('\n--- DELETING COMPANIES (subscriptions + usageMetrics cascade) ---');
  // Delete one by one so cascade behaviour is predictable
  for (const id of TO_DELETE) {
    const subs = await prisma.subscription.deleteMany({ where: { companyId: id } });
    const um = await prisma.usageMetrics.deleteMany({ where: { companyId: id } });
    await prisma.company.delete({ where: { id } });
    console.log(`  deleted ${id} (subs=${subs.count}, usageMetrics=${um.count})`);
  }
}

async function postReport() {
  console.log('\n--- POST-MIGRATION REPORT ---');
  for (const id of [TEAM_1, TEAM_2]) {
    const c = await prisma.company.findUnique({
      where: { id },
      include: { applications: { orderBy: { createdAt: 'asc' } } },
    });
    console.log(`\n${c.name} (${c.email}) — ${c.applications.length} projects`);
    for (const a of c.applications) {
      console.log(`   - ${a.name}  (id=${a.id})`);
    }
  }
  const remaining = await prisma.company.count();
  console.log(`\nTotal companies remaining in DB: ${remaining}`);
}

async function run() {
  try {
    await backup();
    await preflight();
    await migrate();
    await verifyNoOrphans();
    await deleteCompanies();
    await postReport();
    console.log('\nDONE.');
  } catch (err) {
    console.error('\nFAILED:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
