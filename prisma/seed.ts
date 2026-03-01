import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEAM_USERS = [
  { name: 'Team 0', email: 'team0@entrext.com', password: 'team0pass' },
  { name: 'Team 1', email: 'team1@entrext.com', password: 'team1pass' },
  { name: 'Team 2', email: 'team2@entrext.com', password: 'team2pass' },
  { name: 'Team 3', email: 'team3@entrext.com', password: 'team3pass' },
  { name: 'Team 4', email: 'team4@entrext.com', password: 'team4pass' },
  { name: 'Team 5', email: 'team5@entrext.com', password: 'team5pass' },
];

async function main() {
  console.log('--- Starting Database Seeding ---');

  // Seed 6 Entrext Team Users
  for (const user of TEAM_USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const existing = await prisma.company.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      // Update existing user to ensure isEntrextTeam is set
      await prisma.company.update({
        where: { email: user.email },
        data: { passwordHash, isEntrextTeam: true },
      });
      console.log(`Updated Team User: ${user.name} (${user.email})`);
    } else {
      await prisma.company.create({
        data: {
          name: user.name,
          email: user.email,
          passwordHash,
          isEntrextTeam: true,
        },
      });
      console.log(`Created Team User: ${user.name} (${user.email})`);
    }
  }

  console.log('');
  console.log('=== Entrext Team Credentials ===');
  for (const user of TEAM_USERS) {
    console.log(`  ${user.email} / ${user.password}`);
  }
  console.log('================================');
  console.log('');
  console.log('--- Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
