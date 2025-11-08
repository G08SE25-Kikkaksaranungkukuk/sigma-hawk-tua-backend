// npx ts-node -r tsconfig-paths/register prisma/report_seed.ts

import { PrismaClient } from '../generated/prisma/index';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('📝 Seeding 100 dummy reports...');

  // Ensure there is at least one user to own the reports
  let user = await prisma.user.findFirst();
  if (!user) {
    const defaultEmail = process.env.USER_EMAIL || 'user@example.com';
    const defaultPassword = process.env.USER_PASSWORD || 'UserPass123!';
    const hashed = await bcrypt.hash(defaultPassword, 10);

    user = await prisma.user.create({
      data: {
        first_name: 'Seed',
        middle_name: null,
        last_name: 'User',
        birth_date: new Date('1995-01-01'),
        sex: 'OTHER',
        phone: '0000000000',
        profile_url: null,
        social_credit: 0,
        password: hashed,
        email: defaultEmail,
        role: 'USER'
      }
    });

    console.log(`Created seed user: ${user.email}`);
  }

  // Load available report tags
  const tags = await prisma.reportTag.findMany();
  if (!tags || tags.length === 0) {
    throw new Error('No report tags found. Run prisma/seed.ts to create report tags before running this seed.');
  }

  const lorem = [
    'App crashes on click',
    'Slow loading on dashboard',
    'UI overlaps on small screens',
    'Data not saved after submit',
    'Login fails intermittently',
    'Network timeout on requests',
    'Feature request: export to CSV',
    'Typo in settings page',
    'Unexpected behavior when editing',
    'Performance degrades under load'
  ];

  for (let i = 1; i <= 100; i++) {
    const tag = randomFrom(tags);
    const title = `Test Report ${i}: ${tag.label}`;
    const description = `${randomFrom(lorem)} — generated test report #${i}`;
    const is_resolved = Math.random() < 0.2; // ~20% resolved

    await prisma.report.create({
      data: {
        user_id: user.user_id,
        title,
        description,
        is_resolved,
        report_tag: { connect: { id: tag.id } }
      }
    });
  }

  console.log('✅ 100 dummy reports created');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding reports:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
