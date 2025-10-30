-- ====================================
-- BRAIN BOX - PRODUCTION DATA IMPORT
-- ====================================
-- 
-- UPUTSTVO:
-- 1. Otvorite: Database tab → Production Database → My Data tab
-- 2. Kliknite na dugme sa SQL ikonom (gore desno)
-- 3. Copy/paste KOMPLETАН ovaj fajl i kliknite "Run"
-- 4. Kategorije će se pojaviti u dropdown meniju!
-- ====================================

-- 1. ADMIN USER (username: admin, password: admin123)
INSERT INTO users (id, username, password) 
VALUES ('bb49b1b8-01b2-4b5a-80e8-aaebdbac5f62', 'admin', '$2b$10$jrPQfZbBz83pEKydcx1cquzMmimPMVwFqI9ZxZEatvC479mahPCnm') 
ON CONFLICT (id) DO NOTHING;

-- 2. PACKAGE CATEGORIES (7 kategorija)
INSERT INTO package_categories (id, value, label_me, label_en, is_active, sort_order) 
VALUES 
  ('7f713c93-16d6-4c77-8f03-9eee76c813b6', 'newyear', 'Novogodišnji Paketi', 'New Year Packages', 1, 0),
  ('bb01ee1b-f8ab-4013-a7ff-869d4941a05d', 'corporate', 'Korporativni Paketi', 'Corporate Packages', 1, 1),
  ('e26297c5-20e6-4037-878b-abfee99af438', 'eko', 'Eko Paketi', 'Eco Packages', 1, 2),
  ('407390e7-67e4-4418-9d4b-da44955d8cb6', 'lokalni', 'Lokalni Proizvođači', 'Local Producers', 1, 3),
  ('0ef844c9-04fa-45f5-8a4d-ec7cba6da350', 'premium-vip', 'Premium VIP', 'Premium VIP', 1, 4),
  ('Allae0IqJgCmv3KvfHKs4', 'tehnologija', 'Tehnologija', 'Technology', 1, 5),
  ('jlxpH0jIM_xP9SBN31KyP', 'sport', 'Sport i Rekreacija', 'Sport & Recreation', 1, 6)
ON CONFLICT (id) DO NOTHING;

-- 3. USPEŠNO! ✅
-- Kategorije su unete. Sada možete:
-- - Otvoriti https://promopaketi.com i videti kategorije u dropdown meniju
-- - Pakete dodati kasnije kroz admin panel
