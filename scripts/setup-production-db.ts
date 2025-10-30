/**
 * Production Database Setup Script
 * This script initializes the production database with all required tables.
 * Run this manually when production database is empty.
 * 
 * Usage: tsx scripts/setup-production-db.ts
 */

import { neon } from '@neondatabase/serverless';

async function setupProductionDatabase() {
  // Use DATABASE_URL from environment (production database)
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🚀 Setting up production database...');
  console.log('📍 Database URL:', databaseUrl.substring(0, 30) + '...');
  
  const sql = neon(databaseUrl);

  try {
    // Create users table
    console.log('  → Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;

    // Create package_categories table
    console.log('  → Creating package_categories table...');
    await sql`
      CREATE TABLE IF NOT EXISTS package_categories (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name_me TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description_me TEXT,
        description_en TEXT,
        icon TEXT,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      );
    `;

    // Create packages table
    console.log('  → Creating packages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name_me TEXT NOT NULL,
        name_en TEXT NOT NULL,
        category_id VARCHAR REFERENCES package_categories(id) ON DELETE SET NULL,
        description_me TEXT NOT NULL,
        description_en TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        image TEXT,
        is_featured INTEGER NOT NULL DEFAULT 0,
        featured_order INTEGER
      );
    `;

    // Create package_products table
    console.log('  → Creating package_products table...');
    await sql`
      CREATE TABLE IF NOT EXISTS package_products (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name_me TEXT NOT NULL,
        name_en TEXT NOT NULL,
        package_id VARCHAR NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
        description_me TEXT NOT NULL,
        description_en TEXT NOT NULL,
        specs_me TEXT,
        specs_en TEXT,
        images TEXT[],
        sort_order INTEGER DEFAULT 0
      );
    `;

    // Create inquiries table
    console.log('  → Creating inquiries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT NOT NULL,
        package_id VARCHAR REFERENCES packages(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Create hero_slides table
    console.log('  → Creating hero_slides table...');
    await sql`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title_me TEXT NOT NULL,
        title_en TEXT NOT NULL,
        subtitle_me TEXT,
        subtitle_en TEXT,
        image TEXT NOT NULL,
        cta_text_me TEXT,
        cta_text_en TEXT,
        cta_link TEXT,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      );
    `;

    // Create menu_items table
    console.log('  → Creating menu_items table...');
    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        label_me TEXT NOT NULL,
        label_en TEXT NOT NULL,
        link TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      );
    `;

    // Create contact_info table
    console.log('  → Creating contact_info table...');
    await sql`
      CREATE TABLE IF NOT EXISTS contact_info (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        phone TEXT,
        email TEXT,
        whatsapp TEXT,
        viber TEXT,
        address_me TEXT,
        address_en TEXT,
        map_latitude TEXT,
        map_longitude TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Create about_page table
    console.log('  → Creating about_page table...');
    await sql`
      CREATE TABLE IF NOT EXISTS about_page (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title_me TEXT NOT NULL,
        title_en TEXT NOT NULL,
        content_me TEXT NOT NULL,
        content_en TEXT NOT NULL,
        mission_me TEXT,
        mission_en TEXT,
        vision_me TEXT,
        vision_en TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Create newsletter_subscribers table
    console.log('  → Creating newsletter_subscribers table...');
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
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

    // Insert default custom package section
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

    // Insert default contact info
    console.log('  → Inserting default contact info...');
    await sql`
      INSERT INTO contact_info (email, phone, whatsapp, viber, address_me, address_en)
      SELECT 
        'info@brainbox.me',
        '+382 XX XXX XXX',
        '+382 XX XXX XXX',
        '+382 XX XXX XXX',
        'Adresa, Grad, Crna Gora',
        'Address, City, Montenegro'
      WHERE NOT EXISTS (SELECT 1 FROM contact_info LIMIT 1);
    `;

    console.log('✅ Production database setup completed successfully!');
    console.log('');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - package_categories');
    console.log('   - packages (with is_featured and featured_order columns)');
    console.log('   - package_products');
    console.log('   - inquiries');
    console.log('   - hero_slides');
    console.log('   - menu_items');
    console.log('   - contact_info');
    console.log('   - about_page');
    console.log('   - newsletter_subscribers');
    console.log('   - custom_package_section');
    console.log('');
    console.log('🎉 Production database is ready!');
    console.log('⚠️  Note: Tables are created but empty. You may need to add data through the admin panel.');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    throw error;
  }
}

// Run setup
setupProductionDatabase()
  .then(() => {
    console.log('✨ Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
