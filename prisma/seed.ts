import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Create a Test Company
  const passwordHash = await bcrypt.hash('password123', 10);
  const company = await prisma.company.upsert({
    where: { email: 'test@example.com' },
    update: { passwordHash },
    create: {
      name: 'Test Company',
      email: 'test@example.com',
      passwordHash: passwordHash,
    },
  });
  console.log(`Created/Updated Company: ${company.name} (${company.id})`);

  // 2. Create a Test Application
  const application = await prisma.application.upsert({
    where: { id: 'app_clx7y89z00000abc12345' },
    update: {},
    create: {
      id: 'app_clx7y89z00000abc12345',
      name: 'Main App',
      companyId: company.id,
    },
  });
  console.log(`Created/Updated Application: ${application.name} (${application.id})`);

  // 3. Create Sample Feedback with Tags
  const feedbackItems = [
    {
      title: 'Dark Mode Support',
      description: 'The app needs a dark mode for better night usability.',
      status: 'Planned',
      userId: 'user_1',
      tags: ['Feature', 'UI/UX']
    },
    {
      title: 'CSV Export',
      description: 'Allow users to export their feedback data to CSV files.',
      status: 'Open',
      userId: 'user_2',
      tags: ['Feature']
    },
    {
      title: 'Mobile App',
      description: 'Would love to have a mobile app version for voting on the go.',
      status: 'In Progress',
      userId: 'user_3',
      tags: ['Feature', 'Enhancement']
    },
  ];

  for (const item of feedbackItems) {
    const existing = await prisma.feedback.findFirst({
      where: { title: item.title, applicationId: application.id }
    });

    if (existing) {
      console.log(`Feedback already exists: ${item.title}`);
      continue;
    }

    const feedback = await prisma.feedback.create({
      data: {
        title: item.title,
        description: item.description,
        status: item.status,
        userId: item.userId,
        applicationId: application.id,
        tags: {
          create: item.tags.map(tag => ({ name: tag }))
        }
      },
    });
    console.log(`Created Feedback: ${feedback.title}`);

    await prisma.vote.create({
      data: {
        applicationId: application.id,
        feedbackId: feedback.id,
        userId: 'admin_1',
        voteType: 'UPVOTE',
      }
    });
  }

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
