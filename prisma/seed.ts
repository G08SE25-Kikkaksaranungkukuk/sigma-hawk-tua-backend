import { PrismaClient } from '../generated/prisma/index';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed Interests
  const interests = [
    { key: 'SEA', label: 'Sea & Beach', emoji: '🏖️', color: '#4FC3F7', description: 'Beaches, coastal areas, and marine activities' },
    { key: 'MOUNTAIN', label: 'Mountain & Hills', emoji: '⛰️', color: '#66BB6A', description: 'Mountain ranges, hiking trails, and scenic viewpoints' },
    { key: 'WATERFALL', label: 'Waterfalls', emoji: '💧', color: '#42A5F5', description: 'Natural waterfalls and cascades' },
    { key: 'NATIONAL_PARK', label: 'National Parks', emoji: '🏞️', color: '#26A69A', description: 'Protected natural areas and wildlife reserves' },
    { key: 'ISLAND', label: 'Islands', emoji: '🏝️', color: '#29B6F6', description: 'Tropical islands and archipelagos' },
    { key: 'TEMPLE', label: 'Temples & Shrines', emoji: '🙏', color: '#7986CB', description: 'Religious sites, temples, and spiritual places' },
    { key: 'SHOPPING_MALL', label: 'Shopping Malls', emoji: '🛍️', color: '#BA68C8', description: 'Modern shopping centers and retail complexes' },
    { key: 'MARKET', label: 'Local Markets', emoji: '🏪', color: '#FF9800', description: 'Traditional markets and street vendors' },
    { key: 'CAFE', label: 'Cafes & Coffee', emoji: '☕', color: '#FFB74D', description: 'Coffee shops, cafes, and local beverages' },
    { key: 'HISTORICAL', label: 'Historical Sites', emoji: '🏛️', color: '#FFEB3B', description: 'Ancient ruins, historical buildings, and heritage sites' },
    { key: 'AMUSEMENT_PARK', label: 'Amusement Parks', emoji: '🎢', color: '#F06292', description: 'Theme parks, roller coasters, and entertainment venues' },
    { key: 'ZOO', label: 'Zoos & Wildlife', emoji: '🦁', color: '#4CAF50', description: 'Zoos, safari parks, and animal sanctuaries' },
    { key: 'FESTIVAL', label: 'Festivals & Events', emoji: '🎉', color: '#F44336', description: 'Cultural festivals, celebrations, and local events' },
    { key: 'MUSEUM', label: 'Museums & Galleries', emoji: '🏛️', color: '#9C27B0', description: 'Art galleries, museums, and cultural exhibitions' },
    { key: 'FOOD_STREET', label: 'Food Streets', emoji: '🍴', color: '#E91E63', description: 'Street food, food courts, and culinary experiences' },
    { key: 'BEACH_BAR', label: 'Beach Bars', emoji: '🍹', color: '#00BCD4', description: 'Beachside bars, cocktails, and nightlife by the sea' },
    { key: 'THEATRE', label: 'Theatre & Shows', emoji: '🎭', color: '#607D8B', description: 'Theaters, live performances, and cultural shows' }
  ];

  console.log('📍 Seeding interests...');
  for (const interest of interests) {
    await prisma.interest.upsert({
      where: { key: interest.key },
      update: interest,
      create: interest,
    });
  }

  // Seed Travel Styles
  const travelStyles = [
    { key: 'BUDGET', label: 'Budget Travel', emoji: '💰', color: '#4CAF50', description: 'Affordable accommodations and activities' },
    { key: 'COMFORT', label: 'Comfort Travel', emoji: '🏨', color: '#2196F3', description: 'Mid-range hotels and comfortable experiences' },
    { key: 'LUXURY', label: 'Luxury Travel', emoji: '👑', color: '#9C27B0', description: 'High-end accommodations and premium services' },
    { key: 'BACKPACKER', label: 'Backpacker', emoji: '🎒', color: '#FF9800', description: 'Hostels, local transport, authentic experiences' },
    { key: 'FAMILY_FRIENDLY', label: 'Family Friendly', emoji: '🏡', color: '#E91E63', description: 'Family accommodations and child-friendly activities' }
  ];

  console.log('✈️ Seeding travel styles...');
  for (const travelStyle of travelStyles) {
    await prisma.travelStyle.upsert({
      where: { key: travelStyle.key },
      update: travelStyle,
      create: travelStyle,
    });
  }

  // Seed a test user
  console.log('👤 Seeding test user...');
  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      first_name: 'Test',
      last_name: 'User',
      birth_date: new Date('2000-01-01'),
      sex: 'M',
      phone: '0123456789',
      password: 'testpassword', // In production, hash passwords!
      email: 'testuser@example.com',
    },
  });

  // Seed a test group
  console.log('👥 Seeding test group...');
  const testGroup = await prisma.group.upsert({
    where: { group_id: 1 }, // Change if you want a different id
    update: {},
    create: {
      group_name: 'Test Group',
      group_leader_id: testUser.user_id,
      description: 'A group for testing purposes',
      max_members: 10,
    },
  });

  // Link user to group (Belongs)
  await prisma.belongs.upsert({
    where: {
      A_B: {
        A: testGroup.group_id,
        B: testUser.user_id,
      },
    },
    update: {},
    create: {
      A: testGroup.group_id,
      B: testUser.user_id,
    },
  });

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
