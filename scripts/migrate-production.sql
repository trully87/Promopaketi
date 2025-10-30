-- Migration script to add missing columns and tables to production database
-- Run this script against your PRODUCTION database

-- Add isFeatured and featuredOrder columns to packages table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'packages' AND column_name = 'is_featured') THEN
        ALTER TABLE packages ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'packages' AND column_name = 'featured_order') THEN
        ALTER TABLE packages ADD COLUMN featured_order INTEGER;
    END IF;
END $$;

-- Create custom_package_section table if it doesn't exist
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

-- Insert default custom package section if table is empty
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

COMMIT;
