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

  const reportTags = [
      { key: "BUG", label: "Bug/Error", emoji: '🐛', description: "Application crashes, errors, or unexpected behavior" },
      { key: "PERFORMANCE", label: "Performance Issue", emoji: '⚡', description: "Slow loading, lag, or system performance problems" },
      { key: "UI_UX", label: "UI/UX Problem", emoji: '🎨', description: "Design issues, layout problems, or usability concerns" },
      { key: "DATA_LOSS", label: "Data Loss", emoji: '💾', description: "Missing data, sync issues, or data corruption" },
      { key: "LOGIN_AUTH", label: "Login/Authentication", emoji: '🥷', description: "Cannot login, logout issues, or authentication problems" },
      { key: "NETWORK", label: "Network/Connectivity", emoji: '📡', description: "Connection errors, timeout, or network-related issues" },
      { key: "FEATURE_REQUEST", label: "Feature Request", emoji: '✨', description: "Suggestions for new features or improvements" },
      { key: "OTHER", label: "Other", emoji: '❓', description: "Other technical issues not listed above" },
  ];

  console.log('⚠️ Seeding report reasons...');
  for (const reportTag of reportTags) {
    await prisma.reportTag.upsert({
      where: { key: reportTag.key },
      update: reportTag,
      create: reportTag,
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
