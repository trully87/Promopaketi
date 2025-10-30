/**
 * Auto-migration script for production database
 * This script runs automatically when NODE_ENV=production
 * and adds missing columns/tables to the production database
 */

import { neon } from '@neondatabase/serverless';

export async function migrateProductionDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    return;
  }

  console.log('🔄 Running production database migrations...');
  
  // Create a single connection for all migrations (Neon handles pooling automatically)
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Add is_featured and featured_order columns to packages table
    console.log('  → Adding is_featured column to packages table...');
    await sql`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'packages' AND column_name = 'is_featured') THEN
              ALTER TABLE packages ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0;
          END IF;
      END $$;
    `;

    console.log('  → Adding featured_order column to packages table...');
    await sql`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'packages' AND column_name = 'featured_order') THEN
              ALTER TABLE packages ADD COLUMN featured_order INTEGER;
          END IF;
      END $$;
    `;

    // Create custom_package_section table
    console.log('  → Creating custom_package_section table...');
    await sql`
      CREATE TABLE IF NOT EXISTS custom_package_section (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          title_me TEXT NOT NULL,
          title_en TEXT NOT NULL,
          description_me TEXT NOT NULL,
          description_en TEXT NOT NULL,
          cta_text_me TEXT NOT NULL,
          cta_text_en TEXT NOT NULL,
          image TEXT NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Insert default custom package section if table is empty
    console.log('  → Inserting default custom package section...');
    await sql`
      INSERT INTO custom_package_section (
          title_me, 
          title_en, 
          description_me, 
          description_en, 
          cta_text_me, 
          cta_text_en, 
          image
      )
      SELECT 
          'Kreirajte Vaš Savršeni Paket',
          'Create Your Perfect Package',
          'Imate specifične zahtjeve? Naš tim će kreirati personalizovani paket prilagođen vašim potrebama i budžetu.',
          'Have specific requirements? Our team will create a personalized package tailored to your needs and budget.',
          'Kontaktirajte Nas',
          'Contact Us',
          '/uploads/Custom_package_consultation_scene_ba549a84.png'
      WHERE NOT EXISTS (SELECT 1 FROM custom_package_section LIMIT 1);
    `;

    // ======================================
    // SEED DATA (only if tables are empty)
    // ======================================
    
    // NOTE: Admin user is NOT auto-seeded for security reasons.
    // Admin must be created manually through Database UI or setup process.

    // Seed package categories
    console.log('  → Seeding package categories...');
    const categoriesResult = await sql`SELECT COUNT(*) as count FROM package_categories`;
    const categoryCount = parseInt(categoriesResult[0].count);
    
    if (categoryCount === 0) {
      console.log('     Adding 7 default categories...');
      await sql`
        INSERT INTO package_categories (id, value, label_me, label_en, is_active, sort_order) VALUES
        ('7f713c93-16d6-4c77-8f03-9eee76c813b6', 'newyear', 'Novogodišnji Paketi', 'New Year Packages', 1, 0),
        ('bb01ee1b-f8ab-4013-a7ff-869d4941a05d', 'corporate', 'Korporativni Paketi', 'Corporate Packages', 1, 1),
        ('e26297c5-20e6-4037-878b-abfee99af438', 'eko', 'Eko Paketi', 'Eco Packages', 1, 2),
        ('407390e7-67e4-4418-9d4b-da44955d8cb6', 'lokalni', 'Lokalni Proizvođači', 'Local Producers', 1, 3),
        ('0ef844c9-04fa-45f5-8a4d-ec7cba6da350', 'premium-vip', 'Premium VIP', 'Premium VIP', 1, 4),
        ('Allae0IqJgCmv3KvfHKs4', 'tehnologija', 'Tehnologija', 'Technology', 1, 5),
        ('jlxpH0jIM_xP9SBN31KyP', 'sport', 'Sport i Rekreacija', 'Sport & Recreation', 1, 6)
        ON CONFLICT (id) DO NOTHING;
      `;
      console.log('     ✓ Categories seeded!');
    } else {
      console.log(`     ✓ Categories already exist (${categoryCount} found)`);
    }

    console.log('✅ Production database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}
