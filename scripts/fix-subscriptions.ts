/**
 * Database Fix Script
 * Run this to ensure all existing companies have default FREE subscriptions
 * 
 * Usage: npx tsx scripts/fix-subscriptions.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for companies without subscriptions...');

    // Get all companies
    const companies = await prisma.company.findMany({
        include: {
            subscription: true,
        },
    });

    console.log(`Found ${companies.length} companies`);

    // Create subscriptions for companies that don't have one
    let fixed = 0;
    for (const company of companies) {
        if (!company.subscription) {
            console.log(`Creating FREE subscription for company: ${company.email}`);
            await prisma.subscription.create({
                data: {
                    companyId: company.id,
                    plan: 'FREE',
                    status: 'ACTIVE',
                },
            });
            fixed++;
        }
    }

    console.log(`✅ Fixed ${fixed} companies`);
    console.log(`✅ All companies now have subscriptions`);
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
