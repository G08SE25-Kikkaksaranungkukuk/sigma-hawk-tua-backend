-- Database Seed Script
-- Run this script to populate initial data for the application

BEGIN;

-- Seed Interests
INSERT INTO interests (key, label, emoji, color, description, created_at, updated_at)
VALUES 
  ('SEA', 'Sea & Beach', '🏖️', '#4FC3F7', 'Beaches, coastal areas, and marine activities', NOW(), NOW()),
  ('MOUNTAIN', 'Mountain & Hills', '⛰️', '#66BB6A', 'Mountain ranges, hiking trails, and scenic viewpoints', NOW(), NOW()),
  ('WATERFALL', 'Waterfalls', '💧', '#42A5F5', 'Natural waterfalls and cascades', NOW(), NOW()),
  ('NATIONAL_PARK', 'National Parks', '🏞️', '#26A69A', 'Protected natural areas and wildlife reserves', NOW(), NOW()),
  ('ISLAND', 'Islands', '🏝️', '#29B6F6', 'Tropical islands and archipelagos', NOW(), NOW()),
  ('TEMPLE', 'Temples & Shrines', '🙏', '#7986CB', 'Religious sites, temples, and spiritual places', NOW(), NOW()),
  ('SHOPPING_MALL', 'Shopping Malls', '🛍️', '#BA68C8', 'Modern shopping centers and retail complexes', NOW(), NOW()),
  ('MARKET', 'Local Markets', '🏪', '#FF9800', 'Traditional markets and street vendors', NOW(), NOW()),
  ('CAFE', 'Cafes & Coffee', '☕', '#FFB74D', 'Coffee shops, cafes, and local beverages', NOW(), NOW()),
  ('HISTORICAL', 'Historical Sites', '🏛️', '#FFEB3B', 'Ancient ruins, historical buildings, and heritage sites', NOW(), NOW()),
  ('AMUSEMENT_PARK', 'Amusement Parks', '🎢', '#F06292', 'Theme parks, roller coasters, and entertainment venues', NOW(), NOW()),
  ('ZOO', 'Zoos & Wildlife', '🦁', '#4CAF50', 'Zoos, safari parks, and animal sanctuaries', NOW(), NOW()),
  ('FESTIVAL', 'Festivals & Events', '🎉', '#F44336', 'Cultural festivals, celebrations, and local events', NOW(), NOW()),
  ('MUSEUM', 'Museums & Galleries', '🏛️', '#9C27B0', 'Art galleries, museums, and cultural exhibitions', NOW(), NOW()),
  ('FOOD_STREET', 'Food Streets', '🍴', '#E91E63', 'Street food, food courts, and culinary experiences', NOW(), NOW()),
  ('BEACH_BAR', 'Beach Bars', '🍹', '#00BCD4', 'Beachside bars, cocktails, and nightlife by the sea', NOW(), NOW()),
  ('THEATRE', 'Theatre & Shows', '🎭', '#607D8B', 'Theaters, live performances, and cultural shows', NOW(), NOW())
ON CONFLICT (key) 
DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Seed Travel Styles
INSERT INTO travel_styles (key, label, emoji, color, description, created_at, updated_at)
VALUES 
  ('BUDGET', 'Budget Travel', '💰', '#4CAF50', 'Affordable accommodations and activities', NOW(), NOW()),
  ('COMFORT', 'Comfort Travel', '🏨', '#2196F3', 'Mid-range hotels and comfortable experiences', NOW(), NOW()),
  ('LUXURY', 'Luxury Travel', '👑', '#9C27B0', 'High-end accommodations and premium services', NOW(), NOW()),
  ('BACKPACKER', 'Backpacker', '🎒', '#FF9800', 'Hostels, local transport, authentic experiences', NOW(), NOW()),
  ('FAMILY_FRIENDLY', 'Family Friendly', '🏡', '#E91E63', 'Family accommodations and child-friendly activities', NOW(), NOW())
ON CONFLICT (key) 
DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Seed Report Tags
INSERT INTO report_tags (key, label, emoji, description, created_at, updated_at)
VALUES 
  ('BUG', 'Bug/Error', '🐛', 'Application crashes, errors, or unexpected behavior', NOW(), NOW()),
  ('PERFORMANCE', 'Performance Issue', '⚡', 'Slow loading, lag, or system performance problems', NOW(), NOW()),
  ('UI_UX', 'UI/UX Problem', '🎨', 'Design issues, layout problems, or usability concerns', NOW(), NOW()),
  ('DATA_LOSS', 'Data Loss', '💾', 'Missing data, sync issues, or data corruption', NOW(), NOW()),
  ('LOGIN_AUTH', 'Login/Authentication', '🔑', 'Cannot login, logout issues, or authentication problems', NOW(), NOW()),
  ('NETWORK', 'Network/Connectivity', '📡', 'Connection errors, timeout, or network-related issues', NOW(), NOW()),
  ('FEATURE_REQUEST', 'Feature Request', '✨', 'Suggestions for new features or improvements', NOW(), NOW()),
  ('OTHER', 'Other', '❓', 'Other technical issues not listed above', NOW(), NOW())
ON CONFLICT (key) 
DO UPDATE SET
  label = EXCLUDED.label,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  updated_at = NOW();

COMMIT;

-- Verify seeded data
SELECT 'Interests' as table_name, COUNT(*) as count FROM interests
UNION ALL
SELECT 'TravelStyles' as table_name, COUNT(*) as count FROM travel_styles
UNION ALL
SELECT 'ReportTags' as table_name, COUNT(*) as count FROM report_tags;
