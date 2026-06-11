const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TEAM_1 = '69a41de35cbcf4f0c89e8968';
const TEAM_2 = '69a41de35cbcf4f0c89e8969';

// Match by name case-insensitively; whitespace-tolerant
const TARGET_NAMES = ['Soho Space', 'OpinVox', 'CurioCafe', 'Nurturely', 'FutureFit', 'PickSpy'];

async function backup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `backup-shift-${stamp}.json`);
  const apps = await prisma.application.findMany();
  fs.writeFileSync(file, JSON.stringify({ takenAt: new Date().toISOString(), applications: apps }, null, 2));
  console.log(`Backup written: ${file}  (applications=${apps.length})\n`);
  return file;
}

async function findTargets() {
  const norm = s => s.replace(/\s+/g, '').toLowerCase();
  const wantedSet = new Set(TARGET_NAMES.map(norm));

  const apps = await prisma.application.findMany({});
  const matched = apps.filter(a => wantedSet.has(norm(a.name)));

  console.log('--- TARGETS ---');
  for (const a of matched) {
    const where = a.companyId === TEAM_1 ? 'Team 1' : a.companyId === TEAM_2 ? 'Team 2' : `other(${a.companyId})`;
    console.log(`  ${a.name.padEnd(15)} id=${a.id}  current=${where}`);
  }

  // Sanity checks
  const missing = TARGET_NAMES.filter(n => !matched.find(a => norm(a.name) === norm(n)));
  if (missing.length) throw new Error('Missing projects in DB: ' + missing.join(', '));

  const wrongHome = matched.filter(a => a.companyId !== TEAM_2);
  if (wrongHome.length) {
    console.log('\nWARNING: some targets are NOT currently under Team 2:');
    for (const a of wrongHome) console.log(`  ${a.name} -> companyId=${a.companyId}`);
    console.log('Continuing anyway and moving them to Team 1.');
  }
  console.log('');
  return matched;
}

async function move(targets) {
  console.log('--- MOVING ---');
  const ids = targets.map(t => t.id);
  const res = await prisma.application.updateMany({
    where: { id: { in: ids } },
    data: { companyId: TEAM_1 },
  });
  console.log(`Reparented ${res.count} applications -> Team 1\n`);
}

async function report() {
  console.log('--- POST-MOVE REPORT ---');
  for (const id of [TEAM_1, TEAM_2]) {
    const c = await prisma.company.findUnique({
      where: { id },
      include: { applications: { orderBy: { createdAt: 'asc' } } },
    });
    console.log(`\n${c.name} (${c.email}) — ${c.applications.length} projects`);
    for (const a of c.applications) console.log(`   - ${a.name}`);
  }
}

(async () => {
  try {
    await backup();
    const targets = await findTargets();
    await move(targets);
    await report();
    console.log('\nDONE.');
  } catch (err) {
    console.error('\nFAILED:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
