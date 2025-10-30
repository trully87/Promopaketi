/**
 * Auto-migration script for production database
 * This script runs automatically when NODE_ENV=production
 * and adds missing columns/tables to the production database
 */

import { neon } from '@neondatabase/serverless';

async function migrateProductionDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found');
    return;
  }

  console.log('🔄 Running production database migrations...');
  
  const sql = neon(databaseUrl);

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
          '/uploads/custom-packages-hero.jpg'
      WHERE NOT EXISTS (SELECT 1 FROM custom_package_section LIMIT 1);
    `;

    console.log('✅ Production database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

// Run migrations if in production
if (process.env.NODE_ENV === 'production') {
  migrateProductionDatabase()
    .then(() => {
      console.log('🎉 Ready to start production server');
    })
    .catch((error) => {
      console.error('💥 Migration failed, but continuing...', error);
      // Don't crash the server, just log the error
    });
}

export { migrateProductionDatabase };
