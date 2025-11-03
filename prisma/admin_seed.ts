// npx ts-node -r tsconfig-paths/register prisma/admin_seed.ts

import { PrismaClient } from '../generated/prisma/index';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Seeding admin user...');

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const plainPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

  const hashed = await bcrypt.hash(plainPassword, 10);

  const adminData = {
    first_name: 'Admin',
    middle_name: null,
    last_name: 'User',
    birth_date: new Date('1990-01-01'),
    sex: 'OTHER',
    phone: '0000000000',
    profile_url: null,
    social_credit: 0,
    password: hashed,
    email,
    role: 'ADMIN'
  };

  const user = await prisma.user.upsert({
    where: { email },
    update: adminData,
    create: adminData,
  });

  console.log(`✅ Admin user upserted: ${user.email} (id=${user.user_id})`);
  console.log('ℹ️ If you used default credentials, consider changing them immediately.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
