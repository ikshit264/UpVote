const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const all = await prisma.company.findMany({
    orderBy: { createdAt: 'asc' },
    include: { applications: true },
  });
  console.log(`Total companies: ${all.length}\n`);
  for (const c of all) {
    console.log(`- ${c.name.padEnd(20)} ${c.email.padEnd(35)} entrext=${c.isEntrextTeam} apps=${c.applications.length}`);
  }
  await prisma.$disconnect();
})();
