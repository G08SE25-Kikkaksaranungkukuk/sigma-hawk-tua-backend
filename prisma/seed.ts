import { PrismaClient } from '../generated/prisma/index';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed Interests
  const interests = [
    { key: 'SEA', label: 'Sea & Beach', emoji: '🏖️', color: '#4FC3F7', description: 'Beaches, coastal areas, and marine activities' },
    { key: 'MOUNTAIN', label: 'Mountain & Nature', emoji: '🏔️', color: '#81C784', description: 'Mountains, hiking, and natural landscapes' },
    { key: 'CULTURE', label: 'Culture & History', emoji: '🏛️', color: '#FFB74D', description: 'Museums, temples, historical sites' },
    { key: 'FOOD', label: 'Food & Culinary', emoji: '🍜', color: '#F06292', description: 'Local cuisine, food markets, restaurants' },
    { key: 'CITY', label: 'City & Urban', emoji: '🏙️', color: '#9575CD', description: 'Shopping, nightlife, urban attractions' },
    { key: 'WILDLIFE', label: 'Wildlife & Safari', emoji: '🦁', color: '#AED581', description: 'National parks, wildlife watching' },
    { key: 'ADVENTURE', label: 'Adventure Sports', emoji: '🧗', color: '#FF8A65', description: 'Extreme sports, rock climbing, adventure activities' },
    { key: 'FAMILY', label: 'Family Activities', emoji: '👨‍👩‍👧‍👦', color: '#64B5F6', description: 'Family-friendly attractions and activities' }
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
