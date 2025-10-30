-- ====================================
-- CREATE ADMIN USER FOR PRODUCTION
-- ====================================
--
-- INSTRUCTIONS:
-- 1. Open: Database tab → Production Database → My Data
-- 2. Find SQL editor (icon in top right)
-- 3. Copy/paste this entire file
-- 4. Click "Run"
-- 5. Login with: admin / admin123
-- 6. IMMEDIATELY change password in admin panel!
-- ====================================

INSERT INTO users (id, username, password)
VALUES (
  'bb49b1b8-01b2-4b5a-80e8-aaebdbac5f62',
  'admin',
  '$2b$10$jrPQfZbBz83pEKydcx1cquzMmimPMVwFqI9ZxZEatvC479mahPCnm'
)
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- ⚠️ SECURITY NOTE:
-- This creates admin with password: admin123
-- CHANGE THIS IMMEDIATELY after first login!
-- ====================================
