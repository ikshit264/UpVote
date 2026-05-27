const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      applications: { orderBy: { createdAt: 'asc' } },
      subscription: true,
    },
  });

  console.log(`Total companies: ${companies.length}\n`);

  for (const c of companies) {
    const hasPwd = !!c.passwordHash;
    const hasGoogle = !!c.googleId;
    const auth = [
      hasPwd ? 'password' : null,
      hasGoogle ? 'google-oauth' : null,
    ].filter(Boolean).join(' + ') || 'NONE';

    console.log(`--- ${c.name} ---`);
    console.log(`  email         : ${c.email}`);
    console.log(`  id            : ${c.id}`);
    console.log(`  isEntrextTeam : ${c.isEntrextTeam}`);
    console.log(`  auth methods  : ${auth}`);
    console.log(`  passwordHash  : ${hasPwd ? c.passwordHash.slice(0, 20) + '... (bcrypt, not reversible)' : '(none)'}`);
    console.log(`  googleId      : ${c.googleId || '(none)'}`);
    console.log(`  plan          : ${c.subscription?.plan || 'NONE'} (${c.subscription?.status || '-'})`);
    console.log(`  projects (${c.applications.length}):`);
    for (const a of c.applications) {
      console.log(`     - ${a.name}`);
    }
    console.log('');
  }

  await prisma.$disconnect();
})();
