// Run this:
// npx ts-node tests/dummy_group.ts
import { PrismaClient } from '../generated/prisma/index';

const prisma = new PrismaClient();

async function seedDummyGroups() {
  // Seed 20 test users and groups
  console.log('👤 Seeding 20 test users and groups...');
  const allInterests = await prisma.interest.findMany();

  // For random group names
  const adjectives = ['Brave', 'Swift', 'Silent', 'Mighty', 'Clever', 'Wild', 'Happy', 'Lucky', 'Bright', 'Calm'];
  const nouns = ['Hawk', 'Tiger', 'Falcon', 'Wolf', 'Lion', 'Eagle', 'Bear', 'Shark', 'Panther', 'Otter'];

  for (let i = 1; i <= 20; i++) {
    // Create user
    const user = await prisma.user.upsert({
      where: { email: `testuser${i}@example.com` },
      update: {},
      create: {
        first_name: `Test${i}`,
        last_name: `User${i}`,
        birth_date: new Date('2000-01-01'),
        sex: i % 2 === 0 ? 'M' : 'F',
        phone: `012345678${i.toString().padStart(2, '0')}`,
        password: 'testpassword',
        email: `testuser${i}@example.com`,
      },
    });

    // Generate random group name
    const groupName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${Math.floor(Math.random() * 1000)}`;

    // Create group
    const group = await prisma.group.upsert({
      where: { group_id: i },
      update: {},
      create: {
        group_name: groupName,
        group_leader_id: user.user_id,
        description: `A group for testing purposes #${i}`,
        max_members: 10,
      },
    });

    // Link user to group (Belongs)
    await prisma.belongs.upsert({
      where: {
        A_B: {
          A: group.group_id,
          B: user.user_id,
        },
      },
      update: {},
      create: {
        A: group.group_id,
        B: user.user_id,
      },
    });

    // Assign 3 random interests to group
    const shuffled = allInterests.sort(() => 0.5 - Math.random());
    const selectedInterests = shuffled.slice(0, 3);
    for (const interest of selectedInterests) {
      await prisma.groupInterest.upsert({
        where: {
          group_id_interest_id: {
            group_id: group.group_id,
            interest_id: interest.id,
          },
        },
        update: {},
        create: {
          group_id: group.group_id,
          interest_id: interest.id,
        },
      });
    }
  }
}

seedDummyGroups()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });